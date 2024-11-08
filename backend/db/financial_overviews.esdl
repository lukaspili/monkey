module default {

    type FinancialOverview extending TimeStamped {
        required shareholder: Shareholder {
            readonly := true;
            constraint exclusive;
            on target delete delete source;
        }

        required totalDueAmount: int64 {
            default := 0;
            constraint expression on (__subject__ >= 0);
        }
        required totalDueShareholdersCount: int64 {
            default := 0;
        }

        required totalOwedAmount: int64 {
            default := 0;
            constraint expression on (__subject__ >= 0);
        }
        required totalOwedShareholdersCount: int64 {
            default := 0;
        }

        largestDebtShareholder: Shareholder;
        required largestDebtAmount: int64 {
            default := 0;
            constraint expression on (__subject__ >= 0);
        }

        largestCreditShareholder: Shareholder;
        required largestCreditAmount: int64 {
            default := 0;
            constraint expression on (__subject__ >= 0);
        }

        constraint expression on ((.shareholder != .largestDebtShareholder) and (.shareholder != .largestCreditShareholder));
    }
}
