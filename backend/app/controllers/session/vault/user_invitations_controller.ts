import db from "#db";
import e from "#db/edgeql/index";
import { GuardUserIsVaultOwner } from "#guards/user_is_vault_owner";
import { SessionUser } from "#models/user";
import { OwnerUserVaultInvitationShape } from "#models/user_vault_invitation";
import { DeleteUserVaultInvitationTask } from "#tasks/delete_user_vault_invitation";
import { Data } from "#utils/data";
import { SessionUserVaultInvitationsValidator } from "#validators/session/vault/user_vault_invitations_validator";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

export default class UserInvitationsController {
  @inject()
  async list({ auth, request }: HttpContext, guardUserIsVaultOwner: GuardUserIsVaultOwner) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const {
      params: { vaultId },
    } = await request.validateUsing(SessionUserVaultInvitationsValidator.list);

    // Only a vault owner can view invitations.
    await guardUserIsVaultOwner.orFail(db.client, { userId, vaultId });

    const data = await e
      .params({ vaultId: e.uuid }, ($) =>
        e.select(e.UserVaultInvitation, (invitation) => {
          const equalsVaultId = e.op(invitation.vault.id, "=", $.vaultId);

          return {
            ...OwnerUserVaultInvitationShape(invitation),
            filter: equalsVaultId,
            order_by: [{ expression: invitation.created, direction: e.DESC }],
          };
        })
      )
      .run(db.client, { vaultId });

    return Data.list(data);
  }

  @inject()
  async view({ auth, request }: HttpContext, guardUserIsVaultOwner: GuardUserIsVaultOwner) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const {
      params: { vaultId, invitationId },
    } = await request.validateUsing(SessionUserVaultInvitationsValidator.view);

    // Only a vault owner can view invitations.
    await guardUserIsVaultOwner.orFail(db.client, { userId, vaultId });

    const data = await e
      .params({ vaultId: e.uuid, invitationId: e.uuid }, ($) =>
        e
          .select(e.UserVaultInvitation, (invitation) => {
            const equalsId = e.op(invitation.id, "=", $.invitationId);
            const equalsVaultId = e.op(invitation.vault.id, "=", $.vaultId);

            return {
              ...OwnerUserVaultInvitationShape(invitation),
              filter: e.all(e.set(equalsId, equalsVaultId)),
            };
          })
          .assert_single()
      )
      .run(db.client, { vaultId, invitationId });

    return Data.orNotFound(data);
  }

  @inject()
  async delete({ auth, request }: HttpContext, task: DeleteUserVaultInvitationTask) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(SessionUserVaultInvitationsValidator.delete);
    await task.delete(db.client, userId, payload);

    return Data.empty();
  }
}
