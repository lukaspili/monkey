import e from "#db/edgeql/index";
import { OperationShare } from "#db/schema";
import { OwnerShareholder, OwnerShareholderShape } from "#models/shareholder";

type Base = Pick<OperationShare, "id">;

export type OwnerOperationShare = Base &
  Pick<OperationShare, "share" | "shareAmount" | "paidAmount" | "owedAmount"> & {
    shareholder: OwnerShareholder;
  };

const BaseShape = e.shape(e.OperationShare, (_) => ({
  id: true,

  // Rest is excluded by default
  share: false,
  shareAmount: false,
  paidAmount: false,
  owedAmount: false,
  shareholder: false,
  operation: false,
}));

export const OwnerOperationShareShape = e.shape(e.OperationShare, (_) => ({
  ...BaseShape(_),

  share: true,
  shareAmount: true,
  paidAmount: true,
  owedAmount: true,
  shareholder: { ...OwnerShareholderShape(_) },
}));
