module default {
    type ResetUserPasswordRequest {
         required slug: str {
            constraint exclusive;
        }

        required email: str {
            constraint email;
            rewrite insert, update using (str_lower(__subject__.email));
        }

        user: User {
            on target delete allow;
        }

        required token: str;

        required completed: bool {
            default := false;
        }

        expiration_date: datetime {
            readonly := true;
            rewrite insert using (datetime_of_statement() + <duration>"10 minutes");
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
            readonly := true;
            rewrite insert using (datetime_of_statement())
        }
        modified: datetime {
            rewrite insert, update using (datetime_of_statement())
        }

        # To find to-be-completed request from slug.
        index on ((.completed, .slug)) except (.completed);

        # To group multiple requests for the same email in a time-range.
        index on ((.email, .created));
    }
}
