import e from "#db/edgeql/index";
import { UserVaultInvitationResponseStatus } from "#db/edgeql/modules/default";
import { NotFoundException } from "#exceptions/not_found_exception";
import { GuardUserIsVaultOwner } from "#guards/user_is_vault_owner";
import { SessionUserVaultInvitationsValidator } from "#validators/session/vault/user_vault_invitations_validator";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import { Client } from "edgedb";

@inject()
export class DeleteUserVaultInvitationTask {
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

    // Only pending invitations can be deleted.
    const result = await e
      .params({ vaultId: e.uuid, invitationId: e.uuid }, ($) =>
        e
          .delete(e.UserVaultInvitation, (invitation) => {
            const equalsInvitationId = e.op(invitation.id, "=", $.invitationId);
            const equalsVaultId = e.op(invitation.vault.id, "=", $.vaultId);
            const isPending = e.op(
              invitation.response_status,
              "=",
              UserVaultInvitationResponseStatus.pending
            );

            return {
              filter: e.all(e.set(equalsInvitationId, equalsVaultId, isPending)),
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
