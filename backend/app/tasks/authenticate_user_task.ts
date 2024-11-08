import e from "#db/edgeql/index";
import AuthService from "#services/auth_service";
import { inject } from "@adonisjs/core";
import { Client } from "edgedb";
import { Transaction } from "edgedb/dist/transaction.js";
import { AccessToken } from "../auth/guards/access_tokens/access_token.js";

@inject()
export class AuthenticateUserTask {
  async createToken(client: Client | Transaction, userId: string): Promise<AccessToken> {
    const insertQuery = e.params(
      {
        userId: e.uuid,
        hash: e.str,
        expiration_date: e.optional(e.datetime),
      },
      ($) => {
        const inserted = e.insert(e.UserAccessToken, {
          user: e.cast(e.User, $.userId),
          hash: $.hash,
          expiration_date: $.expiration_date,
        });

        return e.select(inserted, (_) => ({ ...e.UserAccessToken["*"] }));
      }
    );

    const transientToken = AccessToken.createTransientToken(userId, AuthService.secretLength);

    const token = await insertQuery.run(client, {
      userId,
      hash: transientToken.hash,
      expiration_date: transientToken.expiresAt,
    });

    const accessToken = new AccessToken({
      prefix: AuthService.prefix,
      secret: transientToken.secret,
      identifier: token.id,
      tokenableId: userId,
      hash: token.hash,
      expiresAt: token.expiration_date,
      createdAt: token.created!,
      updatedAt: token.modified!,
      lastUsedAt: token.last_used,
    });

    return accessToken;
  }
}
