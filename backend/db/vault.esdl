module default {
    type Vault extending TimeStamped {
        required name: str;

        multi records := (.<vault[is VaultRecord]);
        multi shareholders := (.<vault[is VaultShareholder]);

        required is_session_user_shareholder := (
            # Alternative query: `(global session_user in .shareholders.user) ?? false`
            # It seems the one below is more efficient, or a better/more consistent pattern. To be confirmed.
            exists (select VaultShareholder filter .vault = __source__ and .user ?= global session_user)
        );

        required is_session_user_owner := (
            exists (select VaultShareholder filter .vault = __source__ and .user ?= global session_user and .is_owner = true)
        );
    }

    type VaultRecord extending TimeStamped {
        required name: str;
        required amount: int64 {
            constraint expression on (__subject__ != 0);
        }
        required event_date: cal::local_date;

        required vault: Vault {
            on target delete delete source;
        }

        multi shares := (.<record[is VaultRecordShare]);

        required is_debit := .amount < 0;
        required is_credit := .amount > 0;

        # To list vault's records sorted by event date.
        index on ((.vault, .event_date));

        access policy shareholders_can_manage
            allow all
            using (.vault.is_session_user_shareholder);
    }

    type VaultRecordShare extending TimeStamped {
        required amount: int64;
        required percentage: int64;

        required shareholder: VaultShareholder {
            on target delete delete source;
        }

        required record: VaultRecord {
            on target delete delete source;
        }

        constraint exclusive on ((.record, .shareholder));

        # TODO: Ensures that the sum of percentages equals 100.
        # TODO: Ensures that the sum of shares equals the amount of the record.
        # TODO: Ensures that shareholders belong to the record's vault.

        access policy shareholders_can_manage
            allow all
            using (.record.vault.is_session_user_shareholder);
    }

    type VaultShareholder extending TimeStamped {
        required user: User {
            readonly := true;
        }

        required vault: Vault {
            readonly := true;
            on target delete delete source;
        }

        required is_owner: bool;

        constraint exclusive on ((.user, .vault));

        # Check that there is always at least one owner.
        trigger check_at_least_one_owner_after_change after insert, update for each do (
            assert(
                (exists (select VaultShareholder filter .vault = __new__.vault and .is_owner = true)),
                message := "at-least-one-owner-required"
            )
        );

        # Check that the last owner cannot leave the vault.
        trigger check_last_owner_cannot_leave after delete for each do (
            assert(
                (exists (select VaultShareholder filter .vault = __old__.vault and .is_owner = true)),
                message := "last-owner-cannot-leave"
            )
        );
    }
}
