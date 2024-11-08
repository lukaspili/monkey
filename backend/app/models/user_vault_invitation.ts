import e from "#db/edgeql/index";
import { UserVaultInvitation } from "#db/schema";
import { PrivateUser, PrivateUserShape, PublicUser, PublicUserShape } from "#models/user";
import { PublicVault, PublicVaultShape } from "#models/vault";

type Base = Pick<UserVaultInvitation, "id" | "created" | "invited_by">;

export type RecipientUserVaultInvitation = Base &
  Pick<UserVaultInvitation, "response_status" | "response_date"> & {
    user: PublicUser;
    vault: PublicVault;
  };

export type OwnerUserVaultInvitation = Base &
  Pick<UserVaultInvitation, "invitation_status"> & {
    user: PublicUser;
  };

export type PrivateUserVaultInvitation = Base &
  Pick<UserVaultInvitation, "response_status" | "response_date" | "invitation_status"> & {
    user: PrivateUser;
    vault: PublicVault;
  };

const BaseShape = e.shape(e.UserVaultInvitation, (_) => ({
  id: true,
  created: true,
  invited_by: true,

  // Exclude rest by default
  invitation_status: false,
  response_status: false,
  response_date: false,
  user: false,
  vault: false,
}));

export const RecipientUserVaultInvitationShape = e.shape(e.UserVaultInvitation, (_) => ({
  ...BaseShape(_),
  response_status: true,
  response_date: true,
  user: {
    ...PublicUserShape(_),
  },
  vault: {
    ...PublicVaultShape(_),
  },
}));

export const OwnerUserVaultInvitationShape = e.shape(e.UserVaultInvitation, (_) => ({
  ...BaseShape(_),
  invitation_status: true,
  user: {
    ...PublicUserShape(_),
  },
}));

export const PrivateUserVaultInvitationShape = e.shape(e.UserVaultInvitation, (_) => ({
  ...BaseShape(_),
  response_status: true,
  response_date: true,
  invitation_status: true,
  user: {
    ...PrivateUserShape(_),
  },
  vault: {
    ...PublicVaultShape(_),
  },
}));
