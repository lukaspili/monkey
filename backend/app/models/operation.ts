import e from "#db/edgeql/index";
import { Operation } from "#db/schema";
import { OperationLedgerEntry, OperationLedgerEntryShape } from "#models/ledger_entry";
import { OwnerOperationShare, OwnerOperationShareShape } from "#models/operation_share";

type Base = Pick<Operation, "id">;

export type OwnerOperation = Base &
  Pick<Operation, "title" | "description" | "amount" | "eventDate"> & {
    shares: OwnerOperationShare[];
    entries: OperationLedgerEntry[];
  };

const BaseShape = e.shape(e.Operation, (_) => ({
  id: true,

  // Rest is excluded by default
  title: false,
  description: false,
  amount: false,
  eventDate: false,
  shares: false,
  entries: false,
}));

export const OwnerOperationShape = e.shape(e.Operation, (_) => ({
  ...BaseShape(_),

  title: true,
  description: true,
  amount: true,
  eventDate: true,
  shares: { ...OwnerOperationShareShape(_) },
  entries: { ...OperationLedgerEntryShape(_) },
}));
