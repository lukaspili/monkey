import { OwnerShareholder } from "@/models/shareholder";

type Base = {
  id: string;
};

export type OwnerFinancialOverview = Base & {
  totalOwedAmount: number;
  totalOwedShareholdersCount: number;
  largestCreditAmount: number;
  largestCreditShareholder?: OwnerShareholder;
  totalDueAmount: number;
  totalDueShareholdersCount: number;
  largestDebtAmount: number;
  largestDebtShareholder?: OwnerShareholder;
};
