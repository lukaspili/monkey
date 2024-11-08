import e from "#db/edgeql/index";
import { AnonymousContact } from "#db/schema";

type Base = Pick<AnonymousContact, "id">;

export type OwnerAnonymousContact = Base & Pick<AnonymousContact, "name" | "initials">;

const BaseShape = e.shape(e.AnonymousContact, (_) => ({
  id: true,

  // Rest is excluded by default
  name: false,
  initials: false,
  owner: false,
}));

export const OwnerAnonymousContactShape = e.shape(e.AnonymousContact, (_) => ({
  ...BaseShape(_),

  name: true,
  initials: true,
}));
