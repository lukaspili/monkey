// https://github.com/adonisjs/auth/blob/develop/modules/access_tokens_guard/access_token.ts

/*
 * @adonisjs/auth
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RuntimeException } from "@adonisjs/core/exceptions";
import { Secret, base64, safeEqual } from "@adonisjs/core/helpers";
import string from "@adonisjs/core/helpers/string";
import { createHash } from "node:crypto";
import { CRC32 } from "./crc32.js";

/**
 * Access token represents a token created for a user to authenticate
 * using the auth module.
 *
 * It encapsulates the logic of creating an opaque token, generating
 * its hash and verifying its hash.
 */
export class AccessToken {
  /**
   * Decodes a publicly shared token and return the series
   * and the token value from it.
   *
   * Returns null when unable to decode the token because of
   * invalid format or encoding.
   */
  static decode(
    value: string,
    prefix: string
  ): null | { identifier: string; secret: Secret<string> } {
    /**
     * Ensure value is a string and starts with the prefix.
     */
    if (typeof value !== "string" || !value.startsWith(`${prefix}`)) {
      return null;
    }

    /**
     * Remove prefix from the rest of the token.
     */
    const token = value.replace(new RegExp(`^${prefix}`), "");
    if (!token) {
      return null;
    }

    const [identifier, ...tokenValue] = token.split(".");
    if (!identifier || tokenValue.length === 0) {
      return null;
    }

    const decodedIdentifier = base64.urlDecode(identifier);
    const decodedSecret = base64.urlDecode(tokenValue.join("."));
    if (!decodedIdentifier || !decodedSecret) {
      return null;
    }

    return {
      identifier: decodedIdentifier,
      secret: new Secret(decodedSecret),
    };
  }

  /**
   * Creates a transient token that can be shared with the persistence
   * layer.
   */
  static createTransientToken(userId: string, size: number, expiresIn?: string | number) {
    let expiresAt: Date | undefined;
    if (expiresIn) {
      expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + string.seconds.parse(expiresIn));
    }

    return {
      userId,
      expiresAt,
      ...this.seed(size),
    };
  }

  /**
   * Creates a secret opaque token and its hash. The secret is
   * suffixed with a crc32 checksum for secret scanning tools
   * to easily identify the token.
   */
  static seed(size: number) {
    const seed = string.random(size);
    const secret = new Secret(`${seed}${new CRC32().calculate(seed)}`);
    const hash = createHash("sha256").update(secret.release()).digest("hex");
    return { secret, hash };
  }

  /**
   * Identifer is a unique sequence to identify the
   * token within database. It should be the
   * primary/unique key
   */
  identifier: string;

  /**
   * Reference to the user id for whom the token
   * is generated.
   */
  tokenableId: string;

  /**
   * The value is a public representation of a token. It is created
   * by combining the "identifier"."secret"
   */
  value?: Secret<string>;

  /**
   * Hash is computed from the seed to later verify the validity
   * of seed
   */
  hash: string;

  /**
   * Date/time when the token instance was created
   */
  createdAt: Date;

  /**
   * Date/time when the token was updated
   */
  updatedAt: Date;

  /**
   * Timestamp at which the token was used for authentication
   */
  lastUsedAt: Date | null;

  /**
   * Timestamp at which the token will expire
   */
  expiresAt: Date | null;

  constructor(attributes: {
    identifier: string;
    tokenableId: string;
    hash: string;
    createdAt: Date;
    updatedAt: Date;
    lastUsedAt: Date | null;
    expiresAt: Date | null;
    prefix?: string;
    secret?: Secret<string>;
  }) {
    this.identifier = attributes.identifier;
    this.tokenableId = attributes.tokenableId;
    this.hash = attributes.hash;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;
    this.expiresAt = attributes.expiresAt;
    this.lastUsedAt = attributes.lastUsedAt;

    /**
     * Compute value when secret is provided
     */
    if (attributes.secret) {
      if (!attributes.prefix) {
        throw new RuntimeException("Cannot compute token value without the prefix");
      }
      this.value = new Secret(
        `${attributes.prefix}${base64.urlEncode(String(this.identifier))}.${base64.urlEncode(
          attributes.secret.release()
        )}`
      );
    }
  }

  /**
   * Check if the token has been expired. Verifies
   * the "expiresAt" timestamp with the current
   * date.
   *
   * Tokens with no expiry never expire
   */
  isExpired() {
    if (!this.expiresAt) {
      return false;
    }

    return this.expiresAt < new Date();
  }

  /**
   * Verifies the value of a token against the pre-defined hash
   */
  verify(secret: Secret<string>): boolean {
    const newHash = createHash("sha256").update(secret.release()).digest("hex");
    return safeEqual(this.hash, newHash);
  }

  toJSON() {
    return {
      type: "bearer",
      token: this.value ? this.value.release() : undefined,
      lastUsedAt: this.lastUsedAt,
      expiresAt: this.expiresAt,
    };
  }
}
