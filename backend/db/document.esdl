module default {
    abstract type BaseDocument {
        required name: str;
        required file: str;
        required directory: str;
        required mime_type: str;
        required size: int64;

        required marked_for_deletion: bool {
            default := false;
        }

        required copy_in_progress: bool {
            default := false;
        }

        required relative_path := .directory ++ '/' ++ .file;

        created: datetime {
            readonly := true;
            rewrite insert using (datetime_of_statement())
        }

        modified: datetime {
            rewrite insert, update using (datetime_of_statement())
        }

        # Relative path does not include the base directory of child types.
        # Thus this constraint is delegated and exclusive to child types.
        delegated constraint exclusive on (.relative_path);

        # To filter out documents that have been marked for deletion in cleanup tasks.
        index on (.marked_for_deletion) except (not(.marked_for_deletion));
    }

    abstract type DocumentUpload extending BaseDocument {
        required signed_url: str;

        # Cannot overload computed properties.
        required path := (global document_uploads_directory) ++ '/' ++ .relative_path;
        required url := (global cdn_url) ++ '/' ++ .path;

        expiration_date: datetime {
            readonly := true;
            rewrite insert using (datetime_of_statement() + <duration>"24 hours");
        }

        # To filter out expired uploads in cleanup tasks.
        index on (.expiration_date);
    }

    abstract type Document extending BaseDocument {
        # Cannot overload computed properties.
        required path := (global documents_directory) ++ '/' ++ .relative_path;
        required url := (global cdn_url) ++ '/' ++ .path;
    }
}
