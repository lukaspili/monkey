import e from "#db/edgeql/index";
import { SignUpRequest } from "#db/schema";
import {
  PrivateEmailVerificationRequest,
  PrivateEmailVerificationRequestShape,
  PublicEmailVerificationRequest,
  PublicEmailVerificationRequestShape,
} from "#models/email_verification_request";

export type PublicSignUpRequest = Pick<SignUpRequest, "id" | "slug" | "completed" | "name"> & {
  email_verification_request: PublicEmailVerificationRequest;
};

export const PublicSignUpRequestShape = e.shape(e.SignUpRequest, (_) => ({
  id: true,
  slug: true,
  completed: true,
  name: true,
  email_verification_request: {
    ...PublicEmailVerificationRequestShape(_),
  },
  password_hash: false,
}));

export type PrivateSignUpRequest = Omit<PublicSignUpRequest, "email_verification_request"> &
  Pick<SignUpRequest, "password_hash"> & {
    email_verification_request: PrivateEmailVerificationRequest;
  };

export const PrivateSignUpRequestShape = e.shape(e.SignUpRequest, (_) => ({
  ...PublicSignUpRequestShape(_),
  email_verification_request: {
    ...PrivateEmailVerificationRequestShape(_),
  },
  password_hash: true,
}));
