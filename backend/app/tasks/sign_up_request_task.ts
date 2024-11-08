import e from "#db/edgeql/index";
import AssertException from "#exceptions/assert_exception";
import { FatalException } from "#exceptions/fatal_exception";
import { NotFoundException } from "#exceptions/not_found_exception";
import { AuthSession } from "#models/auth_session";
import { PrivateEmailVerificationRequest } from "#models/email_verification_request";
import {
  PrivateSignUpRequest,
  PrivateSignUpRequestShape,
  PublicSignUpRequest,
  PublicSignUpRequestShape,
} from "#models/sign_up_request";
import { CreateSignUpRequestPayload, VerifySignUpRequestPayload } from "#payloads/sign_up_payloads";
import { hashPassword } from "#utils/hash";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import { Client } from "edgedb";
import { nanoid } from "nanoid";
import { EmailVerificationTask } from "./email_verification_task.js";
import { FinalizeSignUpTask } from "./finalize_sign_up_task.js";

@inject()
export class SignUpRequestTask {
  constructor(
    protected emailVerificationTask: EmailVerificationTask,
    protected finalizeSignUpTask: FinalizeSignUpTask
  ) {}

  async create(
    client: Client,
    payload: Infer<typeof CreateSignUpRequestPayload>
  ): Promise<PublicSignUpRequest> {
    const { name, email, password } = payload;

    const passwordHash = await hashPassword(password);

    type TransactionResult = {
      // Public request without the password hash and email verification token
      signUpRequest: PublicSignUpRequest;
      // Request contains the verification token
      emailVerificationRequest: PrivateEmailVerificationRequest;
    };

    const result: TransactionResult = await client.transaction(async (tx) => {
      const emailVerificationRequest = await this.emailVerificationTask.create(tx, { email });

      const slug = nanoid();

      const insertSignUpRequest = e.select(
        e.insert(e.SignUpRequest, {
          slug,
          name,
          password_hash: passwordHash,
          email_verification_request: e.cast(
            e.EmailVerificationRequest,
            e.cast(e.uuid, emailVerificationRequest.id)
          ),
        }),
        (_) => ({
          ...PublicSignUpRequestShape(_),
        })
      );

      const signUpRequest = await insertSignUpRequest.run(tx);
      return { signUpRequest, emailVerificationRequest };
    });

    await this.emailVerificationTask.sendEmail(result.emailVerificationRequest);

    return result.signUpRequest;
  }

  async verify(
    client: Client,
    payload: Infer<typeof VerifySignUpRequestPayload>
  ): Promise<AuthSession> {
    const {
      params: { slug },
      token,
    } = payload;

    const toBeCompletedRequest = await e
      .select(e.SignUpRequest, (_) => ({
        id: true,
        email_verification_request: {
          id: true,
        },
        filter_single: { completed: false, slug },
      }))
      .run(client);

    if (!toBeCompletedRequest) {
      throw NotFoundException.of("Sign-up request");
    }

    const completeRequestQuery = e.params({ id: e.uuid }, (params) => {
      const updated = e.update(e.SignUpRequest, (_) => ({
        filter_single: { id: params.id },
        set: {
          completed: true,
        },
      }));
      return e.select(updated, (_) => ({
        ...PrivateSignUpRequestShape(_),
      }));
    });

    const session = await client.transaction(async (tx) => {
      const emailVerificationRequest = await this.emailVerificationTask.verify(tx, {
        id: toBeCompletedRequest.email_verification_request.id,
        token,
      });

      if (!emailVerificationRequest.verified) {
        // This should not happen, as the email verification task should throw an exception if verification fails.
        throw new FatalException("Email verification request failed.");
      }

      // Mark the sign-up request as completed
      const signUpRequest: PrivateSignUpRequest | null = await completeRequestQuery.run(tx, {
        id: toBeCompletedRequest.id,
      });

      if (!signUpRequest) {
        throw new AssertException();
      }

      const newSession = await this.finalizeSignUpTask.createUserAndSignIn(tx, signUpRequest);
      return newSession;
    });

    return session;
  }
}
