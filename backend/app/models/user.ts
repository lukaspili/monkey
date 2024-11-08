import e from "#db/edgeql/index";
import { User } from "#db/schema";
import { PublicDocument } from "#models/document";
import { PublicUserAvatarShape } from "#models/user_avatar";
import {
  PrivateUserEmail,
  PrivateUserEmailShape,
  SessionUserEmail,
  SessionUserEmailShape,
} from "#models/user_email";

type Base = Pick<User, "id" | "name" | "initials"> & {
  avatar: PublicDocument | null;
};

export type PublicUser = Base;

export type SessionUser = Base & { primary_email: SessionUserEmail };

export type PrivateUser = Base & { primary_email: PrivateUserEmail };

const BaseShape = e.shape(e.User, (_) => ({
  id: true,
  name: true,
  initials: true,
  avatar: { ...PublicUserAvatarShape(_) },

  // Rest is excluded by default
  primary_email: false,
  secret: false,
  add_email_requests: false,
  emails: false,
}));

export const PublicUserShape = e.shape(e.User, (_) => ({
  ...BaseShape(_),
}));

export const SessionUserShape = e.shape(e.User, (_) => ({
  ...BaseShape(_),
  primary_email: { ...SessionUserEmailShape(_) },
}));

export const PrivateUserShape = e.shape(e.User, (_) => ({
  ...BaseShape(_),
  primary_email: { ...PrivateUserEmailShape(_) },
}));
