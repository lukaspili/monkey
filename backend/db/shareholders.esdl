module default {

    type Shareholder extending TimeStamped {
        required owner: User {
            readonly := true;
        }

        userContact: UserContact {
            constraint exclusive;
        }

        anonymousContact: AnonymousContact {
            constraint exclusive;
        }

        required isAccountOwner := .userContact.isAccountOwner ?? false;
        required name := assert_exists(.userContact.user.name if exists(.userContact) else .anonymousContact.name);
        required initials := assert_exists(.userContact.user.initials if exists(.userContact) else .anonymousContact.initials);

        required financialOverview := assert_exists((.<shareholder[is FinancialOverview]));

        constraint expression on ((
            (exists(.userContact) and not(exists(.anonymousContact))) or
            (exists(.anonymousContact) and not(exists(.userContact)))
        ));
    }

    type UserContact extending TimeStamped {
        required owner: User {
            readonly := true;
            on target delete delete source;
        }

        required user: User {
            readonly := true;
        }

        isAccountOwner := .user = .owner;

        # TODO: invitation logic

        constraint exclusive on ((.owner, .user));
        constraint exclusive on ((.user, .isAccountOwner)) except (not(.isAccountOwner));

        # index on ((.owner, .isAccountOwner));
    }

    type AnonymousContact extending TimeStamped {
        required owner: User {
            readonly := true;
            on target delete delete source;
        }

        required name: str;
        required initials: str;

        constraint exclusive on ((.owner, .name));
    }

}
