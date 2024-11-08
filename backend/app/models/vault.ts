import e from "#db/edgeql/index";
import { Vault } from "#db/schema";
import { PublicVaultShareholder, PublicVaultShareholderShape } from "#models/vault_shareholder";

type BaseVault = Pick<Vault, "id" | "name">;

export type PublicVault = BaseVault & { shareholders: PublicVaultShareholder[] };

export type ShareholderVault = BaseVault &
  Pick<Vault, "is_session_user_owner" | "is_session_user_shareholder"> & {
    shareholders: PublicVaultShareholder[];
  };

const BaseShape = e.shape(e.Vault, (_) => ({
  id: true,
  name: true,

  // Exclude rest by default
  is_session_user_owner: false,
  is_session_user_shareholder: false,
  records: false,
  shareholders: false,
}));

export const PublicVaultShape = e.shape(e.Vault, (_) => ({
  ...BaseShape(_),
  shareholders: { ...PublicVaultShareholderShape(_) },
}));

export const ShareholderVaultShape = e.shape(e.Vault, (_) => ({
  ...BaseShape(_),
  is_session_user_owner: true,
  is_session_user_shareholder: true,
  shareholders: { ...PublicVaultShareholderShape(_) },
}));
