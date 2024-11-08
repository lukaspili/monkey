import { OperationLedgerEntry } from "@/models/ledger_entry";
import { OwnerOperationShare } from "@/models/operation_share";

type Base = {
  id: string;
};

export type OwnerOperation = Base & {
  title: string;
  description: string;
  amount: number;
  eventDate: string;
  shares: OwnerOperationShare[];
  entries: OperationLedgerEntry[];
};
