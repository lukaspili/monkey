import e from "#db/edgeql/index";
import { assertOneResult } from "#utils/edge";
import { SessionEmailsValidator } from "#validators/session/emails_validator";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import { Client } from "edgedb";

@inject()
export class MakeUserEmailPrimaryTask {
  async makePrimary(
    client: Client,
    userId: string,
    payload: Infer<typeof SessionEmailsValidator.makePrimary>
  ): Promise<void> {
    const {
      params: { id },
    } = payload;

    // 1. Make the requested email primary
    // 2. Set other emails as non-primary
    await client.transaction(async (tx) => {
      // Exclusive constraint on `is_primary` is not deferred,
      // so we need to unset the previous primary email first.
      await assertOneResult(
        e
          .update(e.UserEmail, (email) => {
            const isPrimary = e.op(email.is_primary, "=", true);
            const isOwner = e.op(email.owner, "=", e.cast(e.User, e.cast(e.uuid, userId)));

            return {
              set: { is_primary: false },
              filter: e.op(isPrimary, "and", isOwner),
            };
          })
          .run(tx)
      );

      await assertOneResult(
        e
          .update(e.UserEmail, (_) => ({
            set: { is_primary: true },
            filter_single: { id, owner: e.cast(e.User, e.cast(e.uuid, userId)) },
          }))
          .run(tx)
      );
    });
  }
}
