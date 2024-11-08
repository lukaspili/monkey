import { SessionUser } from "@/models/user";

export type AuthSession = {
  user: SessionUser;
  token: AccessToken;
};

export type AccessToken = {
  token: string;
};
