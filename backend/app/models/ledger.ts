import e from "#db/edgeql/index";
import { Ledger } from "#db/schema";
import { OwnerShareholder, OwnerShareholderShape } from "#models/shareholder";

// Positive balance means the ledger's holder is owed money by the counterparty,
// negative balance means the ledger's holder owes money to the counterparty.

type Base = Pick<Ledger, "id">;

export type OwnerLedger = Base &
  Pick<Ledger, "balance" | "entriesCount"> & {
    holder: OwnerShareholder;
    counterparty: OwnerShareholder;
  };

export type OperationLedger = Base & {
  counterparty: OwnerShareholder;
};

const BaseShape = e.shape(e.Ledger, (_) => ({
  id: true,

  // Rest is excluded by default
  balance: false,
  entriesCount: false,
  created: false,
  holder: false,
  counterparty: false,
}));

export const OwnerLedgerShape = e.shape(e.Ledger, (_) => ({
  ...BaseShape(_),

  balance: true,
  entriesCount: true,
  counterparty: {
    ...OwnerShareholderShape(_),
  },
}));

// From the operation's perspective, we want to see who the ledger's counterparty is.
export const OperationLedgerShape = e.shape(e.Ledger, (_) => ({
  ...BaseShape(_),

  counterparty: {
    ...OwnerShareholderShape(_),
  },
}));
