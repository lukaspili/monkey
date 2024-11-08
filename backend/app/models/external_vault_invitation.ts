import e from "#db/edgeql/index";
import { ExternalVaultInvitation } from "#db/schema";
import { PublicVault, PublicVaultShape } from "#models/vault";

type Base = Pick<ExternalVaultInvitation, "id" | "email" | "invited_by">;

export type OwnerExternalVaultInvitation = Base;

export type RecipientExternalVaultInvitation = Base & { vault: PublicVault };

export type PrivateExternalVaultInvitation = Base & { vault: PublicVault };

const BaseShape = e.shape(e.ExternalVaultInvitation, (_) => ({
  id: true,
  email: true,
  invited_by: true,

  // Exclude rest by default
  vault: false,
}));

export const OwnerExternalVaultInvitationShape = e.shape(e.ExternalVaultInvitation, (_) => ({
  ...BaseShape(_),
}));

export const RecipientExternalVaultInvitationShape = e.shape(e.ExternalVaultInvitation, (_) => ({
  ...BaseShape(_),
  vault: {
    ...PublicVaultShape(_),
  },
}));

export const PrivateExternalVaultInvitationShape = e.shape(e.ExternalVaultInvitation, (_) => ({
  ...BaseShape(_),
  vault: {
    ...PublicVaultShape(_),
  },
}));
