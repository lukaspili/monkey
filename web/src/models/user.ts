import { EmailVerificationRequest } from "@/models/email-verification-request";
import { UserAvatar } from "@/models/user-avatar";

export type User = {
  id: number;
  name: string;
  initials: string;
  avatar?: UserAvatar;
  emails: UserEmail[];
  primaryEmail: UserEmail;
  created: string;
  modified: string;
};

export type SessionUser = User & {};

export type PublicUser = {
  name: string;
  initials: string;
  avatar?: UserAvatar;
};

export type UserEmail = {
  id: string;
  email: string;
  isPrimary: boolean;
};

export type UserEmailRequest = {
  id: string;
  slug: string;
  emailVerificationRequest: EmailVerificationRequest;
};
