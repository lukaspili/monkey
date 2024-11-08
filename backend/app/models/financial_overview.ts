import e from "#db/edgeql/index";
import { FinancialOverview } from "#db/schema";
import { OwnerShareholder, OwnerShareholderShape } from "#models/shareholder";

type Base = Pick<FinancialOverview, "id">;

export type OwnerFinancialOverview = Base &
  Pick<
    FinancialOverview,
    | "totalDueAmount"
    | "totalDueShareholdersCount"
    | "totalOwedAmount"
    | "totalOwedShareholdersCount"
    | "largestDebtAmount"
    | "largestCreditAmount"
  > & {
    largestDebtShareholder?: OwnerShareholder;
    largestCreditShareholder?: OwnerShareholder;
  };

const BaseShape = e.shape(e.FinancialOverview, (_) => ({
  id: true,

  // Rest is excluded by default
  totalDueAmount: false,
  totalDueShareholdersCount: false,
  totalOwedAmount: false,
  totalOwedShareholdersCount: false,
  largestDebtAmount: false,
  largestCreditAmount: false,
  largestDebtShareholder: false,
  largestCreditShareholder: false,
}));

export const OwnerFinancialOverviewShape = e.shape(e.FinancialOverview, (_) => ({
  ...BaseShape(_),

  totalDueAmount: true,
  totalDueShareholdersCount: true,
  totalOwedAmount: true,
  totalOwedShareholdersCount: true,
  largestDebtAmount: true,
  largestCreditAmount: true,
  largestDebtShareholder: {
    ...OwnerShareholderShape(_),
  },
  largestCreditShareholder: {
    ...OwnerShareholderShape(_),
  },
}));
