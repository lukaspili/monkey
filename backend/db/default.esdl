module default {

    required global documents_directory: str {
        default := 'documents';
    }

    required global document_uploads_directory: str {
        default := 'uploads';
    }

    required global cdn_url: str {
        default := 'https://cdn.example.com';
    }

    global session_user_id: uuid;

    global session_user := (
        select User filter .id = global session_user_id
    );

    global onboarding_user_email: str;

    abstract type TimeStamped {
        created: datetime {
            readonly := true;
            rewrite insert using (datetime_of_statement())
        }

        modified: datetime {
            rewrite insert, update using (datetime_of_statement())
        }
    }
}
