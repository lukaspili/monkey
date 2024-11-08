/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from "@adonisjs/core/env";

export default await Env.create(new URL("../", import.meta.url), {
  /*
  |----------------------------------------------------------
  | Base
  |----------------------------------------------------------
  */
  NODE_ENV: Env.schema.enum(["development", "production", "test"] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: "host" }),
  LOG_LEVEL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | App
  |----------------------------------------------------------
  */
  WEB_URL: Env.schema.string(),
  CDN_URL: Env.schema.string(),
  PASSWORD_RESET_TEST_MODE_ENABLED: Env.schema.boolean.optional(),
  PASSWORD_RESET_TEST_TOKEN: Env.schema.string.optional(),
  EMAIL_VERIFICATION_TEST_MODE_ENABLED: Env.schema.boolean.optional(),
  EMAIL_VERIFICATION_TEST_TOKEN: Env.schema.string.optional(),
  RESEND_API_KEY: Env.schema.string(),
  RESEND_TEST_MODE_ENABLED: Env.schema.boolean.optional(),
  REACT_EMAIL_CDN_URL: Env.schema.string(),
  R2_ACCOUNT_ID: Env.schema.string(),
  R2_ACCESS_KEY_ID: Env.schema.string(),
  R2_SECRET_ACCESS_KEY: Env.schema.string(),
  R2_BUCKET: Env.schema.string(),
  R2_DOCUMENTS_DIRECTORY: Env.schema.string(),
  R2_DOCUMENT_UPLOADS_DIRECTORY: Env.schema.string(),
});
