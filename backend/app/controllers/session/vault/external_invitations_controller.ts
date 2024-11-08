import db from "#db";
import e from "#db/edgeql/index";
import { GuardUserIsVaultOwner } from "#guards/user_is_vault_owner";
import { OwnerExternalVaultInvitationShape } from "#models/external_vault_invitation";
import { SessionUser } from "#models/user";
import { DeleteExternalVaultInvitationTask } from "#tasks/delete_external_vault_invitation";
import { Data } from "#utils/data";
import { Validators } from "#validators/session/vault/external_invitations_validator";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

export default class ExternalInvitationsController {
  @inject()
  async list({ auth, request }: HttpContext, guardUserIsVaultOwner: GuardUserIsVaultOwner) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const {
      params: { vaultId },
    } = await request.validateUsing(Validators.Session.Vault.ExternalInvitations.list);

    // Only a vault owner can view invitations
    await guardUserIsVaultOwner.orFail(db.client, { userId, vaultId });

    const data = await e
      .params({ userId: e.uuid, vaultId: e.uuid }, ($) =>
        e.select(e.ExternalVaultInvitation, (invitation) => {
          const equalsVaultId = e.op(invitation.vault.id, "=", $.vaultId);

          return {
            ...OwnerExternalVaultInvitationShape(invitation),
            filter: equalsVaultId,
            order_by: [{ expression: invitation.created, direction: e.DESC }],
          };
        })
      )
      .run(db.client, { userId, vaultId });

    return Data.list(data);
  }

  @inject()
  async view({ auth, request }: HttpContext, guardUserIsVaultOwner: GuardUserIsVaultOwner) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const {
      params: { vaultId, invitationId },
    } = await request.validateUsing(Validators.Session.Vault.ExternalInvitations.view);

    // Only a vault owner can view invitations.
    await guardUserIsVaultOwner.orFail(db.client, { userId, vaultId });

    const data = await e
      .params({ vaultId: e.uuid, invitationId: e.uuid }, ($) =>
        e
          .select(e.ExternalVaultInvitation, (invitation) => {
            const equalsId = e.op(invitation.id, "=", $.invitationId);
            const equalsVaultId = e.op(invitation.vault.id, "=", $.vaultId);

            return {
              ...OwnerExternalVaultInvitationShape(invitation),
              filter: e.all(e.set(equalsId, equalsVaultId)),
            };
          })
          .assert_single()
      )
      .run(db.client, { vaultId, invitationId });

    return Data.orNotFound(data);
  }

  @inject()
  async delete({ auth, request }: HttpContext, task: DeleteExternalVaultInvitationTask) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(
      Validators.Session.Vault.ExternalInvitations.delete
    );
    await task.delete(db.client, userId, payload);

    return Data.empty();
  }
}
