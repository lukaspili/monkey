import e from "#db/edgeql/index";
import {
  PrivateDocumentUpload,
  PrivateDocumentUploadShape,
  PublicDocumentUpload,
  PublicDocumentUploadShape,
} from "#models/document_upload";

// type BaseUserAvatar = BaseDocument;

export type PublicUserAvatarUpload = PublicDocumentUpload;

export type SessionUserAvatarUpload = PublicDocumentUpload;

export type PrivateUserAvatarUpload = PrivateDocumentUpload;

const BaseShape = e.shape(e.UserAvatarUpload, (_) => ({
  user: false,
}));

export const PublicUserAvatarUploadShape = e.shape(e.UserAvatarUpload, (_) => ({
  ...BaseShape(_),
  ...PublicDocumentUploadShape(_),
}));

export const SessionUserAvatarUploadShape = e.shape(e.UserAvatarUpload, (_) => ({
  ...BaseShape(_),
  ...PublicDocumentUploadShape(_),
}));

export const PrivateUserAvatarUploadShape = e.shape(e.UserAvatarUpload, (_) => ({
  ...BaseShape(_),
  ...PrivateDocumentUploadShape(_),
}));
