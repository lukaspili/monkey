import e from "#db/edgeql/index";
import { AuthSession } from "#models/auth_session";
import { PrivateSignUpRequest } from "#models/sign_up_request";
import { SessionUserShape } from "#models/user";
import { generateInitials } from "#utils/string";
import { inject } from "@adonisjs/core";
import { Transaction } from "edgedb/dist/transaction.js";
import { AuthenticateUserTask } from "./authenticate_user_task.js";

@inject()
export class FinalizeSignUpTask {
  constructor(protected authenticateUserTask: AuthenticateUserTask) {}

  async createUserAndSignIn(tx: Transaction, request: PrivateSignUpRequest): Promise<AuthSession> {
    const initials = generateInitials(request.name);

    // In order to insert User, UserEmail and UserSecret as one query, the root insert happens on UserEmail,
    // so we need to extract the User from the result.
    const { email, owner: user } = await Query.insertUserAndRelated.run(tx, {
      user: { name: request.name, initials },
      email: {
        email: request.email_verification_request.email,
        requestId: request.email_verification_request.id,
      },
      secret: { password_hash: request.password_hash },
    });

    // Find external vault invitations that might belong to this user.
    const externalVaultInvitations = await Query.findAndDeleteExternalVaultInvitations.run(tx, {
      email,
    });

    // For each external vault invitation, make the user a shareholder for that vault.
    if (externalVaultInvitations.isNotEmpty()) {
      await Query.insertShareholders.run(tx, {
        items: externalVaultInvitations.map((invitation) => ({
          userId: user.id,
          vaultId: invitation.vault.id,
        })),
      });
    }

    // Sign-in the new user.
    const token = await this.authenticateUserTask.createToken(tx, user.id);

    return { user, token };
  }
}

const Query = {
  insertUserAndRelated: e.params(
    {
      user: e.tuple({
        name: e.str,
        initials: e.str,
      }),
      email: e.tuple({
        email: e.str,
        requestId: e.uuid,
      }),
      secret: e.tuple({
        password_hash: e.str,
      }),
    },
    ($) => {
      const insertSecret = e.insert(e.UserSecret, { password_hash: $.secret.password_hash });

      const insertUser = e.insert(e.User, {
        secret: insertSecret,
        name: $.user.name,
        initials: $.user.initials,
      });

      const insertEmail = e.insert(e.UserEmail, {
        owner: insertUser,
        email: $.email.email,
        email_verification_request: e.cast(e.EmailVerificationRequest, $.email.requestId),
        is_primary: true,
      });

      return e.with(
        [insertSecret, insertUser, insertEmail],
        e.select(insertEmail, (_) => ({
          email: true,
          owner: {
            ...SessionUserShape(_),
          },
        }))
      );
    }
  ),

  findAndDeleteExternalVaultInvitations: e.params({ email: e.str }, ($) =>
    e.select(
      e.delete(e.ExternalVaultInvitation, (_) => ({
        filter: e.op(e.ExternalVaultInvitation.email, "=", $.email),
      })),
      (_) => ({
        vault: {
          id: true,
        },
      })
    )
  ),

  insertShareholders: e.params(
    {
      items: e.array(
        e.tuple({
          userId: e.uuid,
          vaultId: e.uuid,
        })
      ),
    },
    ($) => {
      return e.for(e.array_unpack($.items), (item) => {
        return e.insert(e.VaultShareholder, {
          user: e.cast(e.User, item.userId),
          vault: e.cast(e.Vault, item.vaultId),
          is_owner: false,
        });
      });
    }
  ),
};
