module default {
    # type UserConnection extending TimeStamped {
    #     required owner: User {
    #         readonly := true;
    #     }

    #     user: User {
    #         constraint exclusive;
    #     }

    #     contact: StandaloneContact {
    #         constraint exclusive;
    #     }
    # }

    # type OneSidedConnection extending TimeStamped {
    #     required name: str;
    #     required initials: str;

    #     invite: ContactInvite {
    #         constraint exclusive;
    #     }
    # }

    # type ContactInvite extending TimeStamped {
    #     required email: str;
    #     user: User;
    # }

    # # type Ledger extending TimeStamped {
    # #     required owner: LedgerOwner {
    # #         constraint exclusive;
    # #     }

    # #     required multi entries := .<ledgers[is LedgerEntry];
    # # }

    # type LedgerOwner extending TimeStamped {
    #     # required ledger: Ledger {
    #     #     readonly := true;
    #     # }

    #     user: UserLedgerOwner {
    #         constraint exclusive;
    #     }
    #     guest: GuestLedgerOwner {
    #         constraint exclusive;
    #     }
    # }

    # type UserLedgerOwner extending TimeStamped {
    #     required user: User {
    #         readonly := true;
    #     }
    # }

    # type GuestLedgerOwner extending TimeStamped {
    #     required email: str;
    #     required name: str;
    # }

    # scalar type LedgerEntryKind extending enum<payment, credit>;

    # type Ledger extending TimeStamped {
    #     required owner: LedgerOwner {
    #         constraint exclusive;
    #     }

    #     required multi entries := .<ledgers[is LedgerEntry];
    # }

    # type UserContact extending TimeStamped {
    #     required user: User {
    #         readonly := true;
    #     }
    # }

    # type UserConnection extending TimeStamped {
    #     required user: User {
    #         readonly := true;
    #     }

    #     required contact: UserContact {
    #         readonly := true;
    #     }
    # }
}
