import e from "#db/edgeql/index";
import { UserEmail } from "#db/schema";

type Base = Pick<UserEmail, "id" | "email" | "is_primary">;

export type SessionUserEmail = Base;

export type PrivateUserEmail = Base;

const BaseShape = e.shape(e.UserEmail, (_) => ({
  id: true,
  email: true,
  is_primary: true,

  // Exclude rest by default
  owner: false,
  email_verification_request: false,
}));

export const SessionUserEmailShape = e.shape(e.UserEmail, (_) => ({
  ...BaseShape(_),
}));

export const PrivateUserEmailShape = e.shape(e.UserEmail, (_) => ({
  ...BaseShape(_),
}));
