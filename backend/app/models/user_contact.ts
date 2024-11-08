import e from "#db/edgeql/index";
import { UserContact } from "#db/schema";
import { PublicUser, PublicUserShape } from "#models/user";

type Base = Pick<UserContact, "id">;

export type OwnerUserContact = Base & Pick<UserContact, "isAccountOwner"> & { user: PublicUser };

const BaseShape = e.shape(e.UserContact, (_) => ({
  id: true,

  // Rest is excluded by default
  owner: false,
  user: false,
  isAccountOwner: false,
}));

export const OwnerUserContactShape = e.shape(e.UserContact, (_) => ({
  ...BaseShape(_),

  isAccountOwner: true,
  user: {
    ...PublicUserShape(_),
  },
}));
