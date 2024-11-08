import e from "#db/edgeql/index";
import { DocumentUpload } from "#db/schema";

type BaseDocumentUpload = Pick<DocumentUpload, "id" | "path" | "mime_type" | "signed_url" | "url">;

export type PublicDocumentUpload = BaseDocumentUpload;

export type PrivateDocumentUpload = BaseDocumentUpload &
  Pick<
    DocumentUpload,
    "name" | "file" | "directory" | "size" | "expiration_date" | "created" | "modified"
  >;

const BaseShape = e.shape(e.DocumentUpload, (_) => ({
  id: true,
  path: true,
  mime_type: true,
  signed_url: true,
  url: true,

  // Rest is excluded by default
  name: false,
  file: false,
  directory: false,
  size: false,
  expiration_date: false,
  created: false,
  modified: false,
}));

export const PublicDocumentUploadShape = e.shape(e.DocumentUpload, (_) => ({
  ...BaseShape(_),
}));

export const PrivateDocumentUploadShape = e.shape(e.DocumentUpload, (_) => ({
  ...BaseShape(_),
  name: true,
  file: true,
  directory: true,
  size: true,
  expiration_date: true,
  created: true,
  modified: true,
}));
