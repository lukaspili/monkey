module default {
    scalar type UserVaultInvitationResponseStatus extending enum<pending, accepted, declined>;

    type UserVaultInvitation extending TimeStamped {
        required invited_by: str;

        required vault: Vault {
            readonly := true;
            on target delete delete source;
        }

        required user: User {
            readonly := true;
            on target delete delete source;
        }

        required response_status: UserVaultInvitationResponseStatus {
            default := UserVaultInvitationResponseStatus.pending;
        }

        required responded := .response_status != UserVaultInvitationResponseStatus.pending;

        # Invitation status is visible from the vault side. Declined invitations are shown as pending.
        required invitation_status :=
            UserVaultInvitationResponseStatus.accepted if .response_status = UserVaultInvitationResponseStatus.accepted
            else UserVaultInvitationResponseStatus.pending;

        response_date: datetime {
            rewrite insert using (
                datetime_of_statement()
                if __subject__.response_status != UserVaultInvitationResponseStatus.pending
                else {}
            );

            rewrite update using (
                datetime_of_statement()
                if __subject__.response_status != UserVaultInvitationResponseStatus.pending and __old__.response_status = UserVaultInvitationResponseStatus.pending
                else {}
            );
        }

        constraint exclusive on ((.user, .vault)) {
            errmessage := "invitation-already-exists";
        }

        # Check that the invited user is not already a shareholder of the vault.
        # Run after insert only as `user` and `vault` are readonly.
        trigger check_user_not_shareholder after insert for each do (
            assert(
                (not exists (select VaultShareholder filter .user = __new__.user and .vault = __new__.vault)),
                message := "user-already-shareholder"
            )
        );

        # List invitations for a user, filtered by `response_status`, sorted by date.
        index on ((.user, .response_status, .created));

         # List invitations for a vault, sorted by date.
        index on ((.vault, .created));

        access policy session_user_can_view_and_respond_to_their_own
            allow select, update
            using (.user ?= global session_user);

        access policy owner_can_manage
            allow all
            using (.vault.is_session_user_owner);
    }

    type ExternalVaultInvitation extending TimeStamped {
        required invited_by: str;

        required vault: Vault {
            readonly := true;
            on target delete delete source;
        }

        required email: str {
            readonly := true;
            constraint email;
            rewrite insert using (str_trim(str_lower(__subject__.email)));
        }

        constraint exclusive on ((.email, .vault)) {
            errmessage := "invitation-already-exists";
        }

        # Check that the invited email does not already belong to a registered user.
        # Run after insert only as `email` is readonly.
        trigger check_email_does_not_belong_to_registered_user after insert for each do (
            assert(
                (not exists (select UserEmail filter .email = __new__.email)),
                message := "email-belongs-to-registered-user"
            )
        );

        # List invitations for a vault, sorted by date.
        index on ((.vault, .created));

        access policy owner_can_manage
            allow all
            using (.vault.is_session_user_owner);

        access policy onboarding_user_can_manage_their_own
            allow all
            using (.email ?= global onboarding_user_email);
    }
}
