module default {
    type User extending TimeStamped {
        required name: str;
        required initials: str;

        multi emails := (.<owner[is UserEmail]);
        required single primary_email := (
            select assert_exists(
                (select assert_single((select .emails filter .is_primary = true)))
            )
        );

        multi avatars := (.<user[is UserAvatar]);
        single avatar := (
            select assert_single((select .avatars filter .is_current = true))
        );

        multi add_email_requests := (.<user[is AddUserEmailRequest]);

        required secret: UserSecret {
            on source delete delete target;
            constraint exclusive;
        }
    }

    type UserEmail extending TimeStamped {
        required owner: User {
            on target delete delete source;
        }

        required email: str {
            readonly := true;
            constraint email;
            constraint exclusive;
            rewrite insert using (str_trim(str_lower(__subject__.email)));
        }

        required email_verification_request: EmailVerificationRequest {
            on source delete allow;
            constraint exclusive;
        }

        required is_primary: bool;

        constraint exclusive on ((.is_primary, .owner)) except (not(.is_primary)) {
            errmessage := "unique-primary-email";
        }

        trigger enforce_cannot_delete_primary_email after delete for each do (
            assert(
                (select not __old__.is_primary),
                message := "cannot-delete-primary-email",
            )
        );

        # To find primary email of a user.
        index on ((.owner, .is_primary)) except (not(.is_primary));
    }

    type UserSecret extending TimeStamped {
        required password_hash: str;
    }
}
