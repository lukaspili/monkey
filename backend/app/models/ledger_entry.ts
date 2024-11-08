import e from "#db/edgeql/index";
import { LedgerEntry } from "#db/schema";
import { OperationLedger, OperationLedgerShape } from "#models/ledger";
import { OwnerOperation, OwnerOperationShape } from "#models/operation";

// Positive amount means the ledger's holder is owed money by the counterparty,
// negative amount means the ledger's holder owes money to the counterparty.

type Base = Pick<LedgerEntry, "id" | "amount">;

export type OwnerLedgerEntry = Base & {
  operation: OwnerOperation;
};

export type OperationLedgerEntry = Base & {
  ledger: OperationLedger;
};

const BaseShape = e.shape(e.LedgerEntry, (_) => ({
  id: true,
  amount: true,

  // Rest is excluded by default
  ledger: false,
  operation: false,
}));

export const OwnerLedgerEntryShape = e.shape(e.LedgerEntry, (_) => ({
  ...BaseShape(_),

  operation: {
    ...OwnerOperationShape(_),
  },
}));

// From the operation's perspective, we want to see who the ledger's counterparty is.
export const OperationLedgerEntryShape = e.shape(e.LedgerEntry, (_) => ({
  ...BaseShape(_),

  ledger: {
    ...OperationLedgerShape(_),
  },
}));
