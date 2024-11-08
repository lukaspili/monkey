import e from "#db/edgeql/index";
import { FatalException } from "#exceptions/fatal_exception";
import { NotFoundException } from "#exceptions/not_found_exception";
import { UnauthorizedException } from "#exceptions/unauthorized_exception";
import {
  SessionAddUserEmailRequest,
  SessionAddUserEmailRequestShape,
} from "#models/add_user_email_request";
import { PrivateEmailVerificationRequest } from "#models/email_verification_request";
import {
  CreateAddUserEmailPayload,
  VerifyAddUserEmailPayload,
} from "#payloads/session/email_requests_payloads";
import { assertOneResult } from "#utils/edge";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import { Client, QueryAssertionError } from "edgedb";
import { nanoid } from "nanoid";
import { EmailVerificationTask } from "./email_verification_task.js";

@inject()
export class AddUserEmailTask {
  constructor(private emailVerificationTask: EmailVerificationTask) {}

  async createRequest(
    client: Client,
    userId: string,
    payload: Infer<typeof CreateAddUserEmailPayload>
  ): Promise<SessionAddUserEmailRequest> {
    const { email } = payload;

    type TransactionResult = {
      // Root request without the email verification token
      addEmailRequest: SessionAddUserEmailRequest;
      // Request contains the verification token
      emailVerificationRequest: PrivateEmailVerificationRequest;
    };

    const result: TransactionResult = await client.transaction(async (tx) => {
      const emailVerificationRequest = await this.emailVerificationTask.create(tx, { email });

      const slug = nanoid();

      const insertRequest = e.select(
        e.insert(e.AddUserEmailRequest, {
          slug,
          user: e.cast(e.User, e.cast(e.uuid, userId)),
          email_verification_request: e.cast(
            e.EmailVerificationRequest,
            e.cast(e.uuid, emailVerificationRequest.id)
          ),
        }),
        (_) => ({
          ...SessionAddUserEmailRequestShape(_),
        })
      );

      let addEmailRequest!: SessionAddUserEmailRequest;
      try {
        addEmailRequest = await insertRequest.run(tx);
      } catch (error) {
        if (
          error instanceof QueryAssertionError &&
          error.message.includes("unique-email-by-user")
        ) {
          throw new UnauthorizedException("Email already exists.");
        }
        throw error;
      }
      return { addEmailRequest, emailVerificationRequest };
    });

    await this.emailVerificationTask.sendEmail(result.emailVerificationRequest);

    return result.addEmailRequest;
  }

  async verifyRequest(
    client: Client,
    userId: string,
    payload: Infer<typeof VerifyAddUserEmailPayload>
  ): Promise<SessionAddUserEmailRequest> {
    const {
      token,
      params: { slug },
    } = payload;

    const toBeCompletedRequest = await e
      .select(e.AddUserEmailRequest, (_) => ({
        id: true,
        email_verification_request: {
          id: true,
        },
        filter_single: { completed: false, slug, user: e.cast(e.User, e.cast(e.uuid, userId)) },
      }))
      .run(client);

    if (!toBeCompletedRequest) {
      throw NotFoundException.of("Add user email request");
    }

    const completeRequestQuery = e.params({ id: e.uuid }, (params) => {
      const updated = e.update(e.AddUserEmailRequest, (_) => ({
        filter_single: { id: params.id },
        set: {
          completed: true,
        },
      }));
      return e.select(updated, (_) => ({
        ...SessionAddUserEmailRequestShape(_),
      }));
    });

    const request = await client.transaction(async (tx) => {
      const emailVerificationRequest = await this.emailVerificationTask.verify(tx, {
        id: toBeCompletedRequest.email_verification_request.id,
        token,
      });

      if (!emailVerificationRequest.verified) {
        // This should not happen, as the email verification task should throw an exception if verification fails.
        throw new FatalException("Email verification request failed.");
      }

      // Add email to the user
      await e
        .insert(e.UserEmail, {
          is_primary: false,
          email: emailVerificationRequest.email,
          owner: e.cast(e.User, e.cast(e.uuid, userId)),
          email_verification_request: e.cast(
            e.EmailVerificationRequest,
            e.cast(e.uuid, emailVerificationRequest.id)
          ),
        })
        .run(tx);

      // Mark the request as completed
      const completedRequest = await assertOneResult(
        completeRequestQuery.run(tx, {
          id: toBeCompletedRequest.id,
        })
      );

      return completedRequest;
    });

    return request;
  }
}
