import e from "#db/edgeql/index";
import { NotFoundException } from "#exceptions/not_found_exception";
import { DeleteUserEmailRequestPayload } from "#payloads/session/email_requests_payloads";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import { Client } from "edgedb";

@inject()
export class DeleteUserEmailRequestTask {
  async delete(
    client: Client,
    userId: string,
    payload: Infer<typeof DeleteUserEmailRequestPayload>
  ): Promise<void> {
    const {
      params: { slug },
    } = payload;

    // 1. Delete the user email request
    // 2. Mark the associated email verification request as deleted
    await client.transaction(async (tx) => {
      const deleteRequestQuery = e.delete(e.AddUserEmailRequest, (_) => ({
        filter_single: { completed: false, slug, user: e.cast(e.User, e.cast(e.uuid, userId)) },
      }));

      const deletedRequest = await e
        .select(deleteRequestQuery, (_) => ({
          id: true,
          email_verification_request: { id: true },
        }))
        .run(tx);

      if (!deletedRequest) {
        throw NotFoundException.of("User email request");
      }

      await e
        .update(e.EmailVerificationRequest, (_) => ({
          set: { deleted: true },
          filter_single: { id: deletedRequest.email_verification_request.id },
        }))
        .run(tx);
    });
  }
}
