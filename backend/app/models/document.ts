import e from "#db/edgeql/index";
import { Document } from "#db/schema";

export type BaseDocument = Pick<Document, "id" | "path" | "mime_type" | "url">;

export type PublicDocument = BaseDocument;

export type PrivateDocument = BaseDocument &
  Pick<Document, "name" | "relative_path" | "directory" | "file" | "created" | "modified">;

const BaseShape = e.shape(e.Document, (_) => ({
  id: true,
  path: true,
  mime_type: true,
  url: true,

  // Rest is excluded by default
  name: false,
  relative_path: false,
  directory: false,
  file: false,
  created: false,
  modified: false,
}));

export const PublicDocumentShape = e.shape(e.Document, (_) => ({
  ...BaseShape(_),
}));

export const PrivateDocumentShape = e.shape(e.Document, (_) => ({
  ...BaseShape(_),
  name: true,
  relative_path: true,
  directory: true,
  file: true,
  created: true,
  modified: true,
}));
