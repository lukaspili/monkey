import e from "#db/edgeql/index";
import { EmailVerificationRequest } from "#db/schema";

export type PublicEmailVerificationRequest = Pick<
  EmailVerificationRequest,
  "id" | "email" | "verified"
>;

export type PrivateEmailVerificationRequest = PublicEmailVerificationRequest &
  Pick<EmailVerificationRequest, "token">;

export const PublicEmailVerificationRequestShape = e.shape(e.EmailVerificationRequest, () => ({
  id: true,
  email: true,
  verified: true,
  token: false,
  deleted: false,
}));

export const PrivateEmailVerificationRequestShape = e.shape(e.EmailVerificationRequest, (_) => ({
  ...PublicEmailVerificationRequestShape(_),
  token: true,
}));
