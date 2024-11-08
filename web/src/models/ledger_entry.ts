import { OperationLedger } from "@/models/ledger";
import { OwnerOperation } from "@/models/operation";

type Base = {
  id: string;
  amount: number;
};

export type OwnerLedgerEntry = Base & {
  operation: OwnerOperation;
};

export type OperationLedgerEntry = Base & {
  ledger: OperationLedger;
};
