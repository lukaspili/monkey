import db from "#db";
import e from "#db/edgeql/index";
import { OwnerShareholderShape } from "#models/shareholder";
import { SessionUser } from "#models/user";
import { CreateStandaloneShareholderTask } from "#tasks/create_standalone_shareholder";
import { Data } from "#utils/data";
import { Validators } from "#validators/session/shareholders_validator";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

export default class ShareholdersController {
  @inject()
  async list({ auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;

    const data = await e
      .params({ userId: e.uuid }, ($) =>
        e.select(e.Shareholder, (shareholder) => {
          const equalsOwnerId = e.op(shareholder.owner.id, "=", $.userId);

          return {
            ...OwnerShareholderShape(shareholder),
            filter: equalsOwnerId,
            order_by: [{ expression: shareholder.initials, direction: e.ASC }],
          };
        })
      )
      .run(db.client, { userId });

    return Data.list(data);
  }

  // @inject()
  // async view({ auth, request }: HttpContext, guardUserIsVaultOwner: GuardUserIsVaultOwner) {
  //   const { id: userId } = auth.getUserOrFail() as SessionUser;
  //   const {
  //     params: { vaultId, invitationId },
  //   } = await request.validateUsing(SessionUserVaultInvitationsValidator.view);

  //   // Only a vault owner can view invitations.
  //   await guardUserIsVaultOwner.orFail(db.client, { userId, vaultId });

  //   const data = await e
  //     .params({ vaultId: e.uuid, invitationId: e.uuid }, ($) =>
  //       e
  //         .select(e.UserVaultInvitation, (invitation) => {
  //           const equalsId = e.op(invitation.id, "=", $.invitationId);
  //           const equalsVaultId = e.op(invitation.vault.id, "=", $.vaultId);

  //           return {
  //             ...OwnerUserVaultInvitationShape(invitation),
  //             filter: e.all(e.set(equalsId, equalsVaultId)),
  //           };
  //         })
  //         .assert_single()
  //     )
  //     .run(db.client, { vaultId, invitationId });

  //   return Data.orNotFound(data);
  // }

  @inject()
  async createStandalone({ auth, request }: HttpContext, task: CreateStandaloneShareholderTask) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(Validators.Session.Shareholders.createStandalone);

    const result = await task.create(db.client, userId, payload);
    return Data.single(result);
  }
}
