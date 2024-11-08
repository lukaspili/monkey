import e from "#db/edgeql/index";
import { FatalException } from "#exceptions/fatal_exception";
import { ForbiddenException } from "#exceptions/forbidden_exception";
import { NotFoundException } from "#exceptions/not_found_exception";
import { UnauthorizedException } from "#exceptions/unauthorized_exception";
import { VerifyEmailMail } from "#mails/verify_email_mail";
import {
  PrivateEmailVerificationRequest,
  PrivateEmailVerificationRequestShape,
  PublicEmailVerificationRequest,
  PublicEmailVerificationRequestShape,
} from "#models/email_verification_request";
import env from "#start/env";
import { isDatabaseConstraintViolation } from "#utils/edge";
import { inject } from "@adonisjs/core";
import mail from "@adonisjs/mail/services/main";
import { Transaction } from "edgedb/dist/transaction.js";
import { customAlphabet } from "nanoid";
import crypto from "node:crypto";

@inject()
export class EmailVerificationTask {
  constructor() {}

  async create(
    client: Transaction,
    payload: { email: string }
  ): Promise<PrivateEmailVerificationRequest> {
    const { email } = payload;

    // Generate a pretty and random token
    const generateToken = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 3);
    const token = `${generateToken()}-${generateToken()}`;

    const insertQuery = e.select(
      e.insert(e.EmailVerificationRequest, {
        email,
        token,
      }),
      (_) => ({ ...PrivateEmailVerificationRequestShape(_) })
    );

    // Database asserts that the email is not verified already.
    let request!: PrivateEmailVerificationRequest;
    try {
      request = await insertQuery.run(client);
    } catch (error) {
      if (isDatabaseConstraintViolation(error, "unique-email-once-verified")) {
        throw new ForbiddenException("This email is already owned.");
      }

      throw error;
    }

    // TODO: Check if email is already taken
    // TODO: Limit number of requests per email in time
    return request;
  }

  async verify(
    client: Transaction,
    payload: { id: string; token: string }
  ): Promise<PublicEmailVerificationRequest> {
    const { id, token } = payload;

    // Find the request to be verified, which cannot be verified already, or previously deleted.
    // Database model is indexed on those 3 filter conditions.
    const requestToBeVerified = await e
      .select(e.EmailVerificationRequest, (_) => ({
        token: true,
        verified: true,
        filter_single: { verified: false, deleted: false, id },
      }))
      .run(client);

    if (!requestToBeVerified) {
      throw NotFoundException.of("Email verification request");
    }

    let isTokenValid = this.compareVerificationToken(token, requestToBeVerified.token);

    if (!isTokenValid) {
      // In development or test, allow to by-pass using a test token
      const testModeEnabled = env.get("EMAIL_VERIFICATION_TEST_MODE_ENABLED", false);
      const testToken = env.get("EMAIL_VERIFICATION_TEST_TOKEN", "");

      if (testModeEnabled && testToken.isEmpty()) {
        throw new FatalException(
          "EMAIL_VERIFICATION_TEST_MODE_ENABLED is enabled, but EMAIL_VERIFICATION_TEST_TOKEN is not set."
        );
      }

      if (testModeEnabled) {
        isTokenValid = this.compareVerificationToken(token, testToken);
      }
    }

    if (!isTokenValid) {
      throw new UnauthorizedException("Invalid verification token.");
    }

    const updateQuery = e.params({ id: e.uuid }, (params) => {
      const updated = e.update(e.EmailVerificationRequest, (_) => ({
        filter_single: { id: params.id },
        set: {
          verified: true,
        },
      }));
      return e.select(updated, (_) => ({
        ...PublicEmailVerificationRequestShape(_),
      }));
    });

    let request!: PublicEmailVerificationRequest;

    // Database checks that the email is not verified already.
    // This should not happen in normal flow, as creating a verification request
    // already checks that a verified email does not exist.
    try {
      request = (await updateQuery.run(client, { id }))!;
    } catch (error) {
      if (isDatabaseConstraintViolation(error, "unique-verified-email")) {
        throw new ForbiddenException("This email is already owned.");
      }

      throw error;
    }

    return request!;
  }

  async sendEmail(request: PrivateEmailVerificationRequest): Promise<void> {
    await mail.sendLater(new VerifyEmailMail(request, true));
  }

  private compareVerificationToken(userInput: string, token: string): boolean {
    const userInputBuffer = Buffer.from(userInput, "utf-8");
    const tokenBuffer = Buffer.from(token, "utf-8");

    // Tokens must be of the same length
    if (userInputBuffer.length !== tokenBuffer.length) {
      return false;
    }

    // Perform constant-time comparison
    return crypto.timingSafeEqual(userInputBuffer, tokenBuffer);
  }
}
