import e from "#db/edgeql/index";
import {
  PrivateDocument,
  PrivateDocumentShape,
  PublicDocument,
  PublicDocumentShape,
} from "#models/document";

// type BaseUserAvatar = BaseDocument;

export type PublicUserAvatar = PublicDocument;

export type PrivateUserAvatar = PrivateDocument;

const BaseShape = e.shape(e.UserAvatar, (_) => ({
  user: false,
}));

export const PublicUserAvatarShape = e.shape(e.UserAvatar, (_) => ({
  ...BaseShape(_),
  ...PublicDocumentShape(_),
}));

export const PrivateUserAvatarShape = e.shape(e.UserAvatar, (_) => ({
  ...BaseShape(_),
  ...PrivateDocumentShape(_),
}));
