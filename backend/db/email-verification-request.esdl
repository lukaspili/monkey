module default {
    type EmailVerificationRequest {
        required email: str {
            constraint email;
            rewrite insert, update using (str_lower(__subject__.email));
        }

        required token: str;
        required verified: bool {
            default := false;
        }
        required deleted: bool {
            default := false;
        }

        verified_date: datetime {
            rewrite insert using (
                datetime_of_statement()
                if __specified__.verified = true
                else {}
            );

            rewrite update using (
                datetime_of_statement()
                if __specified__.verified = true and __old__.verified != true
                else __old__.verified_date
            );
        }

        deleted_date: datetime {
            # Should never happen to insert a deleted request, but handle the case nontheless for completness.
            rewrite insert using (
                datetime_of_statement()
                if __specified__.deleted = true
                else {}
            );

            rewrite update using (
                datetime_of_statement()
                if __specified__.deleted = true and __old__.deleted != true
                else __old__.deleted_date
            );
        }

        created: datetime {
            rewrite insert using (datetime_of_statement())
        }
        modified: datetime {
            rewrite insert, update using (datetime_of_statement())
        }

        # To find non-deleted request for email.
        # Used in `enforce_unique_email_by_user` trigger.
        index on ((.deleted, .email)) except (.deleted);

        # To group multiple requests for the same email in a time-range.
        index on ((.email, .created));

        # To find a request to verify by id. Request must be unverified and/or not previously deleted.
        index on ((.verified, .deleted, .id)) except (.verified or .deleted);

        # To search for verified email (used in `enforce_unique_email_once_verified` trigger).
        # Exclusive constraint is supposed to create index, but it's partial so not sure it covers all the cases.
        index on ((.verified, .email));

        # Enfore unique verified email.
        constraint exclusive on ((.verified, .email)) except (not(.verified)) {
            errmessage := "unique-verified-email";
        }

        # Make sure that once an email is verified, no same email, even unverified, can be added.
        # This complements the above exclusive constraint.
        trigger enforce_unique_email_once_verified after insert, update for each do (
            assert((
                select (
                    # Ignore the assert if the email is verified, as it's already enforced by the exclusive constraint.
                    (select __new__.verified = true) or
                    (select not exists (select EmailVerificationRequest filter .verified = true and .email = str_lower(__new__.email)))
                )),
                message := "unique-email-once-verified",
            )
        )
    }
}
