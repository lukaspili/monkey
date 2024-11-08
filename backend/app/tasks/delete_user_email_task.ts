import e from "#db/edgeql/index";
import { NotFoundException } from "#exceptions/not_found_exception";
import { UnauthorizedException } from "#exceptions/unauthorized_exception";
import { assertOneResult } from "#utils/edge";
import { SessionEmailsValidator } from "#validators/session/emails_validator";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import { Client, QueryAssertionError } from "edgedb";

@inject()
export class DeleteUserEmailTask {
  async delete(
    client: Client,
    userId: string,
    payload: Infer<typeof SessionEmailsValidator.delete>
  ): Promise<void> {
    const {
      params: { id },
    } = payload;

    // 1. Delete the user email
    // 2. Mark the associated email verification request as deleted
    await client.transaction(async (tx) => {
      let deletedUserEmail: {
        id: string;
        email_verification_request: { id: string };
      } | null;

      const deleteUserEmailQuery = e.delete(e.UserEmail, (_) => ({
        filter_single: { id, owner: e.cast(e.User, e.cast(e.uuid, userId)) },
      }));

      try {
        deletedUserEmail = await e
          .select(deleteUserEmailQuery, (_) => ({
            id: true,
            email_verification_request: { id: true },
          }))
          .run(tx);
      } catch (error) {
        // Database asserts that the email to delete is not the primary email
        if (
          error instanceof QueryAssertionError &&
          error.message.includes("cannot-delete-primary-email")
        ) {
          throw new UnauthorizedException("Cannot delete primary email.");
        }

        throw error;
      }

      if (!deletedUserEmail) {
        throw NotFoundException.of("User email");
      }

      await assertOneResult(
        e
          .update(e.EmailVerificationRequest, (_) => ({
            set: { verified: false, deleted: true },
            filter_single: { id: deletedUserEmail.email_verification_request.id },
          }))
          .run(tx)
      );
    });
  }
}
