import e from "#db/edgeql/index";
import { UserVaultInvitationResponseStatus } from "#db/edgeql/modules/default";
import { NotFoundException } from "#exceptions/not_found_exception";
import {
  RecipientUserVaultInvitation,
  RecipientUserVaultInvitationShape,
} from "#models/user_vault_invitation";
import { assertOneResult } from "#utils/edge";
import { Validators } from "#validators/session/vault_invitations_validator";
import { Infer } from "@vinejs/vine/types";
import { Client } from "edgedb";

export class AcceptVaultInvitationTask {
  async accept(
    client: Client,
    userId: string,
    payload: Infer<typeof Validators.Session.VaultInvitations.accept>
  ): Promise<RecipientUserVaultInvitation> {
    const {
      params: { invitationId },
    } = payload;

    const invitation = await client.transaction(async (tx) => {
      // Find the invitation, if valid:
      // - Must be for the given user
      // - Must be pending
      const pendingInvitation = await Query.findInvitation.run(tx, {
        invitationId,
        userId,
      });
      if (!pendingInvitation) {
        throw new NotFoundException();
      }

      const {
        vault: { id: vaultId },
      } = pendingInvitation;

      await Query.insertShareholder.run(tx, { vaultId, userId });
      return await assertOneResult(Query.acceptInvitation.run(tx, { invitationId }));
    });

    return invitation;
  }
}

const Query = {
  findInvitation: e.params({ invitationId: e.uuid, userId: e.uuid }, ($) =>
    e
      .select(e.UserVaultInvitation, (invitation) => {
        const equalsInvitationId = e.op(invitation.id, "=", $.invitationId);
        const equalsUserId = e.op(invitation.user.id, "=", $.userId);
        const isPending = e.op(
          invitation.response_status,
          "=",
          UserVaultInvitationResponseStatus.pending
        );

        return {
          vault: {
            id: true,
          },
          filter: e.all(e.set(equalsInvitationId, equalsUserId, isPending)),
        };
      })
      .assert_single()
  ),

  acceptInvitation: e.params({ invitationId: e.uuid }, ($) => {
    const update = e.update(e.UserVaultInvitation, (_) => {
      return {
        filter_single: { id: $.invitationId },
        set: {
          response_status: UserVaultInvitationResponseStatus.accepted,
        },
      };
    });

    return e.select(update, (_) => ({
      ...RecipientUserVaultInvitationShape(_),
    }));
  }),

  insertShareholder: e.params({ vaultId: e.uuid, userId: e.uuid }, ($) =>
    e.insert(e.VaultShareholder, {
      user: e.cast(e.User, $.userId),
      vault: e.cast(e.Vault, $.vaultId),
      is_owner: false,
    })
  ),
};
