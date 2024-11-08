import e from "#db/edgeql/index";
import { FlowException } from "#exceptions/flow_exception";
import { UnauthorizedException } from "#exceptions/unauthorized_exception";
import { ExternalVaultInvitationMail } from "#mails/external_vault_invitation_mail";
import { UserVaultInvitationMail } from "#mails/user_vault_invitation_mail";
import {
  OwnerExternalVaultInvitationShape,
  PrivateExternalVaultInvitationShape,
} from "#models/external_vault_invitation";
import {
  OwnerUniversalVaultInvitation,
  PrivateUniversalVaultInvitation,
} from "#models/universal_vault_invitation";
import {
  OwnerUserVaultInvitationShape,
  PrivateUserVaultInvitationShape,
} from "#models/user_vault_invitation";
import {
  assertOneResult,
  isDatabaseConstraintViolation,
  isDatabasePolicyViolation,
} from "#utils/edge";
import { SessionUniversalVaultInvitationsValidator } from "#validators/session/vault/universal_vault_invitations_validator";
import { inject } from "@adonisjs/core";
import mail from "@adonisjs/mail/services/main";
import { Infer } from "@vinejs/vine/types";
import { Client } from "edgedb";

@inject()
export class InviteUserToVaultTask {
  constructor() {}

  async invite(
    client: Client,
    userId: string,
    payload: Infer<typeof SessionUniversalVaultInvitationsValidator.create>
  ): Promise<OwnerUniversalVaultInvitation> {
    const {
      params: { vaultId },
      email,
    } = payload;

    // Get the name of the user who is creating the invitation.
    const { name: invitedBy } = await assertOneResult(
      Query.findUserName.run(client, { id: userId })
    );

    // We need a private scoped invitation to send the email.
    const privateScopedInvitation: PrivateUniversalVaultInvitation = await client.transaction(
      async (tx) => {
        // Check if a user exists with the given email.
        const { owner } = (await Query.findUserEmail.run(tx, { email })) ?? {};

        try {
          if (owner) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const invitation = await Query.insertUserInvitation.run(tx, {
              vaultId,
              userId: owner.id,
              invitedBy,
            });

            return {
              kind: "user",
              invitation,
            };
          } else {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const invitation = await Query.insertExternalInvitation.run(tx, {
              vaultId,
              email,
              invitedBy,
            });

            return {
              kind: "external",
              invitation,
            };
          }
        } catch (error) {
          if (isDatabaseConstraintViolation(error, "user-already-shareholder")) {
            throw new UnauthorizedException("The invited user is already part of this vault.");
          }

          if (isDatabaseConstraintViolation(error, "email-belongs-to-registered-user")) {
            throw new FlowException("Failed to invite user to vault.");
          }

          if (isDatabaseConstraintViolation(error, "invitation-already-exists")) {
            throw new FlowException("This invitation already exists.");
          }

          // Access policy defines that only owners can create invitations for a vault.
          if (isDatabasePolicyViolation(error)) {
            throw new UnauthorizedException("Only owners can invite users to the vault.");
          }

          throw error;
        }
      }
    );

    if (privateScopedInvitation.kind === "user") {
      await mail.sendLater(new UserVaultInvitationMail(privateScopedInvitation.invitation));
    } else {
      await mail.sendLater(new ExternalVaultInvitationMail(privateScopedInvitation.invitation));
    }

    // Return the invitation data scoped to the caller = the owner who created the invitation.
    const ownerScopedInvitation: OwnerUniversalVaultInvitation =
      privateScopedInvitation.kind === "user"
        ? {
            kind: "user",
            invitation: await Query.findOwnerUserInvitation.run(client, {
              id: privateScopedInvitation.invitation.id,
            }),
          }
        : {
            kind: "external",
            invitation: await Query.findOwnerExternalInvitation.run(client, {
              id: privateScopedInvitation.invitation.id,
            }),
          };

    return ownerScopedInvitation;
  }
}

const Query = {
  findUserName: e.params({ id: e.uuid }, ($) =>
    e.select(e.User, (_) => ({
      id: true,
      name: true,
      filter_single: { id: $.id },
    }))
  ),

  findVaultWithShareholders: e.params({ vaultId: e.uuid, userId: e.uuid }, ($) =>
    e
      .select(e.Vault, (vault) => {
        const equalsId = e.op(vault.id, "=", $.vaultId);
        const isShareholder = e.op($.userId, "in", vault.shareholders.user.id);

        return {
          id: true,
          shareholders: {
            is_owner: true,
            user: {
              id: true,
            },
          },
          filter: e.all(e.set(equalsId, isShareholder)),
        };
      })
      .assert_single()
  ),

  findUserEmail: e.params({ email: e.str }, ($) =>
    e.select(e.UserEmail, (_) => ({
      owner: {
        id: true,
      },
      filter_single: { email: $.email },
    }))
  ),

  insertUserInvitation: e.params({ vaultId: e.uuid, userId: e.uuid, invitedBy: e.str }, ($) => {
    const insert = e.insert(e.UserVaultInvitation, {
      vault: e.cast(e.Vault, $.vaultId),
      user: e.cast(e.User, $.userId),
      invited_by: $.invitedBy,
    });

    return e.select(insert, (_) => ({
      ...PrivateUserVaultInvitationShape(_),
    }));
  }),

  insertExternalInvitation: e.params({ vaultId: e.uuid, email: e.str, invitedBy: e.str }, ($) => {
    const insert = e.insert(e.ExternalVaultInvitation, {
      vault: e.cast(e.Vault, $.vaultId),
      email: $.email,
      invited_by: $.invitedBy,
    });

    return e.select(insert, (_) => ({
      ...PrivateExternalVaultInvitationShape(_),
    }));
  }),

  findOwnerUserInvitation: e.params({ id: e.uuid }, ($) =>
    e.assert_exists(
      e.select(e.UserVaultInvitation, (_) => ({
        ...OwnerUserVaultInvitationShape(_),
        filter_single: { id: $.id },
      }))
    )
  ),

  findOwnerExternalInvitation: e.params({ id: e.uuid }, ($) =>
    e.assert_exists(
      e.select(e.ExternalVaultInvitation, (_) => ({
        ...OwnerExternalVaultInvitationShape(_),
        filter_single: { id: $.id },
      }))
    )
  ),
};
