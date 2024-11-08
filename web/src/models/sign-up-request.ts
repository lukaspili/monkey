import { EmailVerificationRequest } from "@/models/email-verification-request";

export type SignUpRequest = {
  slug: string;
  name: string;
  emailVerificationRequest: EmailVerificationRequest;
};
