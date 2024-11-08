module default {
    type SignUpRequest {
        required slug: str {
            constraint exclusive;
        }

        required name: str;
        required password_hash: str;
        required completed: bool {
            default := false;
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

        # To find to-be-completed request from slug.
        index on ((.completed, .slug)) except (.completed);
    }
}
