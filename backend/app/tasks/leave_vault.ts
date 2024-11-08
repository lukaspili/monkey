import e, { $infer } from "#db/edgeql/index";
import { NotFoundException } from "#exceptions/not_found_exception";
import { UnauthorizedException } from "#exceptions/unauthorized_exception";
import { isDatabaseConstraintViolation } from "#utils/edge";
import { Validators } from "#validators/session/vault/vault_validator";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import { Client } from "edgedb";

@inject()
export class LeaveVaultTask {
  async leave(
    client: Client,
    userId: string,
    payload: Infer<typeof Validators.Session.Vault.leave>
  ): Promise<void> {
    const {
      params: { vaultId },
    } = payload;

    let result!: $infer<typeof Query.deleteShareholder>;
    try {
      // Database checks that the last shareholder cannot leave the vault.
      result = await Query.deleteShareholder.run(client, { vaultId, userId });
    } catch (error) {
      if (isDatabaseConstraintViolation(error, "last-owner-cannot-leave")) {
        throw new UnauthorizedException(
          "The last owner cannot leave the vault. If the vault is not needed anymore, archive or delete it."
        );
      }

      throw error;
    }

    if (!result) {
      throw new NotFoundException();
    }
  }
}

const Query = {
  deleteShareholder: e.params({ userId: e.uuid, vaultId: e.uuid }, ($) =>
    e
      .delete(e.Shareholder, (shareholder) => {
        const equalsUserId = e.op(shareholder.user.id, "=", $.userId);
        const equalsVaultId = e.op(shareholder.vault.id, "=", $.vaultId);

        return {
          filter: e.all(e.set(equalsUserId, equalsVaultId)),
        };
      })
      .assert_single()
  ),
};
