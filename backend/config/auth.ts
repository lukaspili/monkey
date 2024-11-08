import { defineConfig } from "@adonisjs/auth";
import { Authenticators, InferAuthEvents } from "@adonisjs/auth/types";
import { accessTokensGuard } from "../app/auth/guards/access_tokens/guard.js";
import { UserAccessTokensProvider } from "../app/auth/guards/access_tokens/providers/user_provider.js";

const authConfig = defineConfig({
  default: "app",
  guards: {
    app: accessTokensGuard({ provider: new UserAccessTokensProvider() }),
    gov: accessTokensGuard({ provider: new UserAccessTokensProvider() }),
  },
});

export default authConfig;

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module "@adonisjs/auth/types" {
  interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module "@adonisjs/core/types" {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
