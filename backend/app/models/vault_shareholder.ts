import e from "#db/edgeql/index";
import { VaultShareholder } from "#db/schema";
import { PublicUser, PublicUserShape } from "#models/user";

type BaseVaultShareholder = Pick<VaultShareholder, "id" | "is_owner">;

export type PublicVaultShareholder = BaseVaultShareholder & { user: PublicUser };

const BaseShape = e.shape(e.VaultShareholder, (_) => ({
  id: true,
  is_owner: true,

  // Rest is excluded by default
  user: false,
  vault: false,
}));

export const PublicVaultShareholderShape = e.shape(e.VaultShareholder, (_) => ({
  ...BaseShape(_),
  user: { ...PublicUserShape(_) },
}));
