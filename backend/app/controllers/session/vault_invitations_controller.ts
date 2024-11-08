import db from "#db";
import e from "#db/edgeql/index";
import { SessionUser } from "#models/user";
import { RecipientUserVaultInvitationShape } from "#models/user_vault_invitation";
import { AcceptVaultInvitationTask } from "#tasks/accept_vault_invitation";
import { DeclineVaultInvitationTask } from "#tasks/decline_vault_invitation";
import { Data } from "#utils/data";
import { Validators } from "#validators/session/vault_invitations_validator";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

export default class VaultInvitationsController {
  @inject()
  async list({ auth, request }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const {
      params: { status },
    } = await request.validateUsing(Validators.Session.VaultInvitations.list);

    const data = await e
      .params({ userId: e.uuid, responded: e.bool }, ($) =>
        e.select(e.UserVaultInvitation, (invitation) => {
          const equalsUserId = e.op(invitation.user.id, "=", $.userId);
          const equalsResponded = e.op(invitation.responded, "=", $.responded);

          return {
            ...RecipientUserVaultInvitationShape(invitation),
            filter: e.all(e.set(equalsUserId, equalsResponded)),
            order_by: [{ expression: invitation.created, direction: e.DESC }],
          };
        })
      )
      .run(db.client, {
        userId,
        responded: status === "archived",
      });

    return Data.list(data);
  }

  @inject()
  async view({ auth, request }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const {
      params: { invitationId },
    } = await request.validateUsing(Validators.Session.VaultInvitations.view);

    const data = await e
      .params({ invitationId: e.uuid, userId: e.uuid }, ($) =>
        e
          .select(e.UserVaultInvitation, (invitation) => {
            const equalsId = e.op(invitation.id, "=", $.invitationId);
            const equalsUserId = e.op(invitation.user.id, "=", $.userId);

            return {
              ...RecipientUserVaultInvitationShape(invitation),
              filter: e.all(e.set(equalsId, equalsUserId)),
            };
          })
          .assert_single()
      )
      .run(db.client, { invitationId, userId });

    return Data.orNotFound(data);
  }

  @inject()
  async accept({ auth, request }: HttpContext, task: AcceptVaultInvitationTask) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(Validators.Session.VaultInvitations.accept);
    const data = await task.accept(db.client, userId, payload);

    return Data.single(data);
  }

  @inject()
  async decline({ auth, request }: HttpContext, task: DeclineVaultInvitationTask) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(Validators.Session.VaultInvitations.decline);
    await task.decline(db.client, userId, payload);

    return Data.empty();
  }
}
