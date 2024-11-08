import { inject } from "@adonisjs/core";
import { AccessToken } from "../auth/guards/access_tokens/access_token.js";

import db from "#db";
import e from "#db/edgeql/index";
import { Secret } from "@adonisjs/core/helpers";

@inject()
export default class AuthService {
  /**
   * The length for the token secret. A secret is a cryptographically
   * secure random string.
   */
  static secretLength = 40;

  /**
   * A unique prefix to append to the publicly shared token value.
   */
  static prefix = "mky_";

  /**
   * Verifies a publicly shared access token and returns an
   * access token for it.
   */
  async verifyToken(tokenValue: Secret<string>): Promise<AccessToken | null> {
    const decodedToken = AccessToken.decode(tokenValue.release(), AuthService.prefix);
    if (!decodedToken) {
      return null;
    }

    const query = e.select(e.UserAccessToken, (_) => ({
      ...e.UserAccessToken["*"],
      user: { ...e.User["*"] },
      filter_single: { id: decodedToken.identifier },
    }));

    const token = await query.run(db.client);
    if (token == null) {
      return null;
    }

    const lastUsed = new Date();

    const updateLastUsedQuery = e.update(e.UserAccessToken, () => ({
      filter_single: { id: token.id },
      set: { last_used: lastUsed },
    }));
    await updateLastUsedQuery.run(db.client);

    const accessToken = new AccessToken({
      identifier: token.id,
      tokenableId: token.user.id,
      hash: token.hash,
      createdAt: token.created!,
      updatedAt: token.modified!,
      lastUsedAt: lastUsed,
      expiresAt: token.expiration_date,
    });

    // Ensure the token secret matches the token hash
    if (!accessToken.verify(decodedToken.secret) || accessToken.isExpired()) {
      return null;
    }

    return accessToken;
  }
}
