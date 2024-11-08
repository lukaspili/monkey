import { symbols } from "@adonisjs/auth";
import { Exception } from "@adonisjs/core/exceptions";
import { Secret } from "@adonisjs/core/helpers";
import { HttpContext } from "@adonisjs/core/http";
import { AccessToken } from "./access_token.js";

// export type AccessTokensOptions = {
//   /**
//    * The default expiry for all the tokens. You can also customize
//    * expiry at the time of creating a token as well.
//    *
//    * By default tokens do not expire
//    */
//   expiresIn?: string | number;

//   // /**
//   //  * The length for the token secret. A secret is a cryptographically
//   //  * secure random string.
//   //  *
//   //  * Defaults to 40
//   //  */
//   // tokenSecretLength?: number;

//   // /**
//   //  * A unique prefix to append to the publicly shared token value.
//   //  */
//   // prefix: string;
// };

export interface AccessTokensUserProviderContract<RealUser> {
  [symbols.PROVIDER_REAL_USER]: RealUser;

  /**
   * Create a user object that acts as an adapter between
   * the guard and real user value.
   */
  // createUserForGuard(user: RealUser): Promise<RealUser>;

  /**
   * Create a token for a given user
   */
  createToken(
    user: RealUser,
    options?: {
      expiresIn?: string | number;
    }
  ): Promise<AccessToken>;

  /**
   * Find a user by the user id.
   */
  findById(identifier: string | number | BigInt): Promise<RealUser | null>;

  /**
   * Verify a token by its publicly shared value.
   */
  verifyToken(tokenValue: Secret<string>): Promise<AccessToken | null>;
}

/**
 * Events emitted by the access tokens guard during
 * authentication
 */
export type AccessTokensGuardEvents<RealUser> = {
  /**
   * Attempting to authenticate the user
   */
  "access_tokens_auth:authentication_attempted": {
    ctx: HttpContext;
    guardName: string;
  };

  /**
   * Authentication was successful
   */
  "access_tokens_auth:authentication_succeeded": {
    ctx: HttpContext;
    guardName: string;
    user: RealUser;
    token: AccessToken;
  };

  /**
   * Authentication failed
   */
  "access_tokens_auth:authentication_failed": {
    ctx: HttpContext;
    guardName: string;
    error: Exception;
  };
};
