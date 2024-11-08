import e from "#db/edgeql/index";
import { FatalException } from "#exceptions/fatal_exception";
import { NotFoundException } from "#exceptions/not_found_exception";
import { UnauthorizedException } from "#exceptions/unauthorized_exception";
import { ResetUserPasswordMail } from "#mails/reset_user_password_mail";
import {
  PrivateResetUserPasswordRequest,
  PrivateResetUserPasswordRequestShape,
  PublicResetUserPasswordRequest,
  PublicResetUserPasswordRequestShape,
} from "#models/user_password_reset_request";
import env from "#start/env";
import { assertOneResult } from "#utils/edge";
import { hashPassword } from "#utils/hash";
import { RecoverPasswordsValidator } from "#validators/recover_passwords_validator";
import { inject } from "@adonisjs/core";
import mail from "@adonisjs/mail/services/main";
import { Infer } from "@vinejs/vine/types";
import { isPast } from "date-fns";
import { Client } from "edgedb";
import { nanoid } from "nanoid";
import crypto from "node:crypto";

@inject()
export class ResetUserPasswordTask {
  constructor() {}

  async request(
    client: Client,
    payload: Infer<typeof RecoverPasswordsValidator.request>
  ): Promise<PublicResetUserPasswordRequest> {
    const { email } = payload;
    const slug = nanoid();
    const token = nanoid();

    const query = e.params(
      {
        email: e.str,
        slug: e.str,
        token: e.str,
      },
      ($) => {
        const maybeUser = e
          .select(e.User, (user) => ({
            filter: e.op(user.emails.email, "=", e.str_lower($.email)),
          }))
          .assert_single();

        const insertRequest = e.insert(e.ResetUserPasswordRequest, {
          email: $.email,
          slug: $.slug,
          token: $.token,
          user: maybeUser,
        });

        return e.with(
          [maybeUser, insertRequest],
          e.select(insertRequest, (_) => ({ ...PrivateResetUserPasswordRequestShape(_) }))
        );
      }
    );

    // TODO: Limit number of requests per email in time
    let privateRequest!: PrivateResetUserPasswordRequest;
    try {
      privateRequest = await query.run(client, { email, slug, token });
    } catch (error) {
      //TODO: Handle quota limit error

      // if (
      //   error instanceof QueryAssertionError &&
      //   error.message.includes("unique-email-once-verified")
      // ) {
      //   throw new ForbiddenException("This email is already owned.");
      // }

      throw error;
    }

    // Request might target a non-existing user, which should be look like running normally as to not leak account information.
    if (privateRequest.user) {
      await mail.sendLater(new ResetUserPasswordMail(privateRequest));
    }

    const publicRequest: PublicResetUserPasswordRequest = {
      id: privateRequest.id,
      slug: privateRequest.slug,
      email: privateRequest.email,
      completed: privateRequest.completed,
      expiration_date: privateRequest.expiration_date,
      created: privateRequest.created,
    };

    return publicRequest;
  }

  async reset(
    client: Client,
    payload: Infer<typeof RecoverPasswordsValidator.reset>
  ): Promise<PublicResetUserPasswordRequest> {
    const {
      token,
      password,
      params: { slug },
    } = payload;

    // Find the request to be completed by slug.
    // Database model is indexed on those 3 filter conditions.
    const requestToBeCompleted = await e
      .select(e.ResetUserPasswordRequest, (_) => ({
        filter_single: { completed: false, slug },
        id: true,
        token: true,
        expiration_date: true,
        user: { id: true, secret: { id: true } },
      }))
      .run(client);

    if (!requestToBeCompleted || !requestToBeCompleted.user) {
      throw NotFoundException.of("Reset user password request");
    }

    // Check if the request is expired.
    if (isPast(requestToBeCompleted.expiration_date!)) {
      throw new UnauthorizedException("This password recovery request has expired.");
    }

    let isTokenValid = this.compareVerificationToken(token, requestToBeCompleted.token);

    if (!isTokenValid) {
      // In development or test, allow to by-pass using a test token
      const testModeEnabled = env.get("PASSWORD_RESET_TEST_MODE_ENABLED", false);
      const testToken = env.get("PASSWORD_RESET_TEST_TOKEN", "");

      if (testModeEnabled && testToken.isEmpty()) {
        throw new FatalException(
          "PASSWORD_RESET_TEST_MODE_ENABLED is enabled, but PASSWORD_RESET_TEST_TOKEN is not set."
        );
      }

      if (testModeEnabled) {
        isTokenValid = this.compareVerificationToken(token, testToken);
      }
    }

    if (!isTokenValid) {
      throw new UnauthorizedException("Invalid token.");
    }

    const passwordHash = await hashPassword(password);

    const updateSecretQuery = e.params({ id: e.uuid, passwordHash: e.str }, ($) =>
      e.update(e.UserSecret, (_) => ({
        filter_single: { id: $.id },
        set: {
          password_hash: $.passwordHash,
        },
      }))
    );

    const updateRequestQuery = e.params({ id: e.uuid }, ($) => {
      const update = e.update(e.ResetUserPasswordRequest, (_) => ({
        filter_single: { id: $.id },
        set: {
          completed: true,
        },
      }));

      return e.select(update, (_) => ({ ...PublicResetUserPasswordRequestShape(_) }));
    });

    const request = await client.transaction(async (tx) => {
      await assertOneResult(
        updateSecretQuery.run(tx, {
          id: requestToBeCompleted.user!.secret.id,
          passwordHash,
        })
      );

      return assertOneResult(updateRequestQuery.run(tx, { id: requestToBeCompleted.id }));
    });

    return request!;
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
