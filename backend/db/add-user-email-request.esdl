module default {
    type AddUserEmailRequest {
        required slug: str {
            constraint exclusive;
        }

        required completed: bool {
            default := false;
        }

        required user: User {
            on target delete delete source;
        }

        required email_verification_request: EmailVerificationRequest {
            on source delete allow;
            constraint exclusive;
        }

        completion_date: datetime {
            rewrite insert using (
                datetime_of_statement()
                if __specified__.completed = true
                else {}
            );

            rewrite update using (
                datetime_of_statement()
                if __specified__.completed = true and __old__.completed != true
                else {}
            );
        }

        created: datetime {
            rewrite insert using (datetime_of_statement())
        }
        modified: datetime {
            rewrite insert, update using (datetime_of_statement())
        }

        # To find one to-be-completed request from slug, for user.
        index on ((.completed, .slug, .user)) except (.completed);

        # To find all to-be-completed requests for user.
        index on ((.completed, .user)) except (.completed);

        # Enfore that requests for the same user have unique email.
        # Ingore requests that have been marked as deleted.
        trigger enforce_unique_email_by_user after insert, update for each do (
            assert((
                with requests_for_email := (select EmailVerificationRequest filter .deleted = false and .email = str_lower(__new__.email_verification_request.email)),
                requests_count_for_user := (select count(AddUserEmailRequest filter .user = __new__.user and .email_verification_request in requests_for_email)),
                select requests_count_for_user <= 1
                ),
                message := "unique-email-by-user",
            )
        )
    }
}
