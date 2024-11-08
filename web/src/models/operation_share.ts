type Base = {
  id: string;
};

export type OwnerOperationShare = Base & {
  share: number;
  shareAmount: number;
  paidAmount: number;
  owedAmount: number;
};
