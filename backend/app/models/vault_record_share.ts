import e from "#db/edgeql/index";
import { VaultRecordShare } from "#db/schema";
import { PublicShareholder, PublicShareholderShape } from "#models/vault_shareholder";

type BaseVaultRecordShare = Pick<VaultRecordShare, "id" | "percentage" | "amount"> & {
  shareholder: PublicShareholder;
};

export type PublicVaultRecordShare = BaseVaultRecordShare;

const BaseShape = e.shape(e.VaultRecordShare, (_) => ({
  id: true,
  percentage: true,
  amount: true,
  shareholder: {
    ...PublicShareholderShape(_),
  },
}));

export const PublicVaultRecordShareShape = e.shape(e.VaultRecordShare, (_) => ({
  ...BaseShape(_),
}));
