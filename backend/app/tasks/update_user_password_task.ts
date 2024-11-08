import e from "#db/edgeql/index";
import { UnauthorizedException } from "#exceptions/unauthorized_exception";
import { SessionUser, SessionUserShape } from "#models/user";
import { assertOneResult } from "#utils/edge";
import { hashPassword } from "#utils/hash";
import { SessionAccountValidator } from "#validators/session/account_validator";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import bcrypt from "bcrypt";
import { Client } from "edgedb";

@inject()
export class UpdateUserPasswordTask {
  async update(
    client: Client,
    userId: string,
    payload: Infer<typeof SessionAccountValidator.changePassword>
  ): Promise<SessionUser> {
    const { currentPassword, newPassword } = payload;

    const sessionUser = await client.transaction(async (tx) => {
      const { secret } = await assertOneResult(
        e
          .select(e.User, (_) => ({
            filter_single: { id: e.cast(e.uuid, userId) },
            secret: { id: true, password_hash: true },
          }))
          .run(tx)
      );

      const validPassword = await bcrypt.compare(currentPassword, secret.password_hash);
      if (!validPassword) {
        throw new UnauthorizedException("Invalid current password.");
      }

      const passwordHash = await hashPassword(newPassword);

      await assertOneResult(
        e
          .update(e.UserSecret, (_) => ({
            filter_single: { id: secret.id },
            set: {
              password_hash: passwordHash,
            },
          }))
          .run(tx)
      );

      const user = await assertOneResult(
        e
          .select(e.User, (_) => ({
            ...SessionUserShape(_),
            filter_single: { id: userId },
          }))
          .run(tx)
      );

      return user;
    });

    return sessionUser;
  }
}
