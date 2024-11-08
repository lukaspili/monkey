/*
 * @adonisjs/auth
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { symbols } from "@adonisjs/auth";
import { Secret } from "@adonisjs/core/helpers";
import { AccessToken } from "../access_token.js";
import type { AccessTokensUserProviderContract } from "../types.js";

import db from "#db";
import e from "#db/edgeql/index";
import User from "#models/user";
import AuthService from "#services/auth_service";

export class UserAccessTokensProvider implements AccessTokensUserProviderContract<User> {
  declare [symbols.PROVIDER_REAL_USER]: User;

  /**
   * Finds a user by the user id
   */
  async findById(id: string): Promise<User | null> {
    const userQuery = e.select(e.User, (_) => ({
      ...e.User["*"],
      secret: false,
      filter_single: { id },
    }));
    const user = await userQuery.run(db.client);

    if (!user) {
      return null;
    }

    return user;
  }

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

  async createToken(
    user: User,
    options?: {
      expiresIn?: string | number;
    }
  ): Promise<AccessToken> {
    const transientToken = AccessToken.createTransientToken(
      user.id,
      AuthService.secretLength,
      options?.expiresIn
    );

    const userQuery = e.select(e.User, (_) => ({ filter_single: { id: user.id } }));

    const insertQuery = e.select(
      e.insert(e.UserAccessToken, {
        user: userQuery,
        hash: transientToken.hash,
        expiration_date: transientToken.expiresAt,
      }),
      (_) => ({ ...e.UserAccessToken["*"] })
    );

    const token = await insertQuery.run(db.client);

    return new AccessToken({
      secret: transientToken.secret,
      identifier: token.id,
      tokenableId: user.id,
      hash: token.hash,
      expiresAt: token.expiration_date,
      createdAt: token.created!,
      updatedAt: token.modified!,
      lastUsedAt: token.last_used,
    });
  }
}
