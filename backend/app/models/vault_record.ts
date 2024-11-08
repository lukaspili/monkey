import e from "#db/edgeql/index";
import { VaultRecord } from "#db/schema";
import { PublicVaultRecordShare, PublicVaultRecordShareShape } from "#models/vault_record_share";

type BaseVaultRecord = Pick<VaultRecord, "id" | "name" | "amount" | "event_date"> & {
  shares: PublicVaultRecordShare[];
};

export type PublicVaultRecord = BaseVaultRecord;

const BaseShape = e.shape(e.VaultRecord, (_) => ({
  id: true,
  name: true,
  amount: true,
  event_date: true,
  shares: {
    ...PublicVaultRecordShareShape(_),
  },

  // Exclude rest by default
  vault: false,
}));

export const PublicVaultRecordShape = e.shape(e.VaultRecord, (_) => ({
  ...BaseShape(_),
}));
