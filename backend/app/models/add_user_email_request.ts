import e from "#db/edgeql/index";
import { AddUserEmailRequest } from "#db/schema";
import {
  PublicEmailVerificationRequest,
  PublicEmailVerificationRequestShape,
} from "#models/email_verification_request";

export type SessionAddUserEmailRequest = Pick<AddUserEmailRequest, "id" | "slug" | "completed"> & {
  email_verification_request: PublicEmailVerificationRequest;
};

export const SessionAddUserEmailRequestShape = e.shape(e.AddUserEmailRequest, (_) => ({
  id: true,
  slug: true,
  completed: true,
  email_verification_request: {
    ...PublicEmailVerificationRequestShape(_),
  },
}));
