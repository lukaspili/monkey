import e from "#db/edgeql/index";
import AuthService from "#services/auth_service";
import { Client } from "edgedb";
import { Transaction } from "edgedb/dist/transaction.js";
import { AccessToken } from "../auth/guards/access_tokens/access_token.js";

export default class CreateAccessTokenOp {
  constructor(private client: Client | Transaction) {}

  async run(attributes: { userId: string }): Promise<AccessToken> {
    const { userId } = attributes;
    const transientToken = AccessToken.createTransientToken(userId, AuthService.secretLength);

    const userQuery = e.select(e.User, (_) => ({ filter_single: { id: userId } }));

    const insertQuery = e.select(
      e.insert(e.UserAccessToken, {
        user: userQuery,
        hash: transientToken.hash,
        expiration_date: transientToken.expiresAt,
      }),
      (_) => ({ ...e.UserAccessToken["*"] })
    );

    const token = await insertQuery.run(this.client);

    return new AccessToken({
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
  }
}
