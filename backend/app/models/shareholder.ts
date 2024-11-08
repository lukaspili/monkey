import e from "#db/edgeql/index";
import { Shareholder } from "#db/schema";
import { OwnerAnonymousContact, OwnerAnonymousContactShape } from "#models/anonymous_contact";
import { OwnerUserContact, OwnerUserContactShape } from "#models/user_contact";

type Base = Pick<Shareholder, "id">;

export type OwnerShareholder = Base &
  Pick<Shareholder, "name" | "initials" | "isAccountOwner"> & {
    userContact: OwnerUserContact | null;
    anonymousContact: OwnerAnonymousContact | null;
  };

const BaseShape = e.shape(e.Shareholder, (_) => ({
  id: true,

  // Rest is excluded by default
  name: false,
  initials: false,
  isAccountOwner: false,
  userContact: false,
  anonymousContact: false,
}));

export const OwnerShareholderShape = e.shape(e.Shareholder, (_) => ({
  ...BaseShape(_),

  name: true,
  initials: true,
  isAccountOwner: true,
  userContact: {
    ...OwnerUserContactShape(_),
  },
  anonymousContact: {
    ...OwnerAnonymousContactShape(_),
  },
}));
