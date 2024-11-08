module default {

    type Ledger extending TimeStamped {
        required holder: Shareholder {
            readonly := true;
        }

        required counterparty: Shareholder {
            readonly := true;
        }

        # The balance is the sum of all the amounts in the ledger entries.
        # It reprensents the amount that the counterparty owes to the holder.
        # If the balance is negative, it means the holder owes money to the counterparty.
        required balance: int64 {
            default := 0;
        }

        required entriesCount: int64 {
            default := 0;
        }

        multi entries := (.<ledger[is LedgerEntry]);

        constraint exclusive on ((.holder, .counterparty));
        constraint expression on ((.holder != .counterparty));
    }

    type LedgerEntry extending TimeStamped {
        required operation: Operation {
            readonly := true;
            on target delete delete source;
        }

        required ledger: Ledger {
            readonly := true;
        }

        # Positive amount means it's a debt, negative amount means it's a credit.
        required amount: int64;

        constraint exclusive on ((.operation, .ledger));

        # trigger update_ledger_balance_after_insert after insert for each
        # do (
        #     with
        #         ledger := __new__.ledger,
        #         entries := ledger.entries,
        #         new_balance := sum(entries.amount),
        #         new_count := count(entries)
        #     update __new__.ledger
        #         set {
        #             balance := new_balance,
        #             entriesCount := new_count
        #         }
        # );

        # trigger update_ledger_balance_after_update after update for each
        # when (__old__.amount != __new__.amount)
        # do (
        #     with
        #         ledger := __new__.ledger,
        #         entries := ledger.entries,
        #         new_balance := sum(entries.amount),
        #     update ledger
        #         set {
        #             balance := new_balance,
        #         }
        # );

        # trigger update_ledger_balance_after_delete after delete for each
        # do (
        #     with
        #         ledger := __old__.ledger,
        #         entries := ledger.entries,
        #         new_balance := sum(entries.amount),
        #         new_count := count(entries)
        #     update ledger
        #         set {
        #             balance := new_balance,
        #             entriesCount := new_count
        #         }
        # );
    }

}
