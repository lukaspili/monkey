module default {
    abstract type AuthAccessToken {
        required hash: str;
        last_used: datetime;
        expiration_date: datetime;

        created: datetime {
            rewrite insert using (datetime_of_statement())
        }
        modified: datetime {
            rewrite update using (datetime_of_statement())
        }
    }

    type UserAccessToken extending AuthAccessToken {
        required user: User {
            on target delete delete source
        }
    }
}
