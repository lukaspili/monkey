import { OwnerShareholder } from "@/models/shareholder";

type Base = {
  id: string;
};

export type OwnerLedger = Base & {
  balance: number;
  entriesCount: number;
  counterparty: OwnerShareholder;
};

export type OperationLedger = Base & {
  counterparty: OwnerShareholder;
};
