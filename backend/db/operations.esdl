module default {

    type Operation extending TimeStamped {
        required owner: User {
            readonly := true;
        }

        required title: str;
        description: str;

        required amount: int64 {
            constraint expression on (__subject__ > 0);
        }

        required eventDate: cal::local_date;

        multi shares := (.<operation[is OperationShare]);
        multi entries := (.<operation[is LedgerEntry]);
    }

    type OperationShare extending TimeStamped {
        required operation: Operation {
            readonly := true;
            on target delete delete source;
        }

        required shareholder: Shareholder {
            readonly := true;
        }

        required share: int16;
        required shareAmount: int64;
        required paidAmount: int64;

        # Positive amount means the shareholder owes money to the other shareholders,
        # negative amount means the other shareholders owe money to the shareholder.
        required owedAmount: int64;

        constraint exclusive on ((.operation, .shareholder));
    }

}
