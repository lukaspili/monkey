import { SessionUser } from "#models/user";
import { AccessToken } from "../auth/guards/access_tokens/access_token.js";

export type AuthSession = {
  user: SessionUser;
  token: AccessToken;
};
