module default {
    type UserAvatarUpload extending DocumentUpload {
        required user: User {
            on target delete restrict;
        }
    }

    type UserAvatar extending Document {
        required is_current: bool;

        required user: User {
            on target delete restrict;
        }

        # Current avatar cannot be deleted.
        constraint expression on (
            .is_current = false or .marked_for_deletion = false
        ) {
            errmessage := "cannot-delete-current-avatar";
        }

        # User can have only one current avatar.
        constraint exclusive on ((.user, .is_current)) except (not(.is_current)) {
            errmessage := "unique-current-avatar";
        }

        # To find current avatar of a user.
        index on ((.user, .is_current)) except (not(.is_current));
    }
}
