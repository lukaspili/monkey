import e from "#db/edgeql/index";
import { NotFoundException } from "#exceptions/not_found_exception";
import { GuardUserIsVaultOwner } from "#guards/user_is_vault_owner";
import { SessionUserVaultInvitationsValidator } from "#validators/session/vault/user_vault_invitations_validator";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import { Client } from "edgedb";

@inject()
export class DeleteExternalVaultInvitationTask {
  constructor(private readonly guardUserIsVaultOwner: GuardUserIsVaultOwner) {}

  async delete(
    client: Client,
    userId: string,
    payload: Infer<typeof SessionUserVaultInvitationsValidator.delete>
  ): Promise<void> {
    const {
      params: { vaultId, invitationId },
    } = payload;

    await this.guardUserIsVaultOwner.orFail(client, { userId, vaultId });

    const result = await e
      .params({ vaultId: e.uuid, invitationId: e.uuid }, ($) =>
        e
          .delete(e.ExternalVaultInvitation, (invitation) => {
            const equalsInvitationId = e.op(invitation.id, "=", $.invitationId);
            const equalsVaultId = e.op(invitation.vault.id, "=", $.vaultId);

            return {
              filter: e.all(e.set(equalsInvitationId, equalsVaultId)),
            };
          })
          .assert_single()
      )
      .run(client, { vaultId, invitationId });

    if (!result) {
      throw new NotFoundException();
    }
  }
}
