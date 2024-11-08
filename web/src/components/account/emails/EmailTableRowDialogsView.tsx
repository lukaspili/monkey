"use client";

import { ConfirmDeleteDialog } from "@/components/account/emails/ConfirmDeleteDialog";
import { MakePrimaryDialog } from "@/components/account/emails/MakePrimaryDialog";
import { VerifyEmailDialog } from "@/components/account/emails/VerifyEmailDialog";
import { UserEmail, UserEmailRequest } from "@/models/user";
import { atom, useAtom } from "jotai";

export const requestToVerifyAtom = atom<UserEmailRequest | null>(null);
export const emailToDeleteAtom = atom<UserEmail | UserEmailRequest | null>(null);
export const emailToMakePrimaryAtom = atom<UserEmail | null>(null);

// Show dialogs as children of the main view to avoid issues like showing dialog as descendants of Dropdowns (which would close the dialog when the dropdown is closed)
export function EmailsTableRowDialogs({
  email,
  request,
}: {
  email?: UserEmail;
  request?: UserEmailRequest;
}) {
  // const [isAddOpen, setAddOpen] = useAtom(showAddDialogAtom);
  const [requestToVerify, setRequestToVerify] = useAtom(requestToVerifyAtom);
  const [emailToDelete, setEmailToDelete] = useAtom(emailToDeleteAtom);
  const [emailToMakePrimary, setEmailToMakePrimary] = useAtom(emailToMakePrimaryAtom);

  return (
    <>
      {email && (
        <MakePrimaryDialog
          email={email}
          isOpen={emailToMakePrimary?.id === email.id}
          onClose={(_) => setEmailToMakePrimary(null)}
        />
      )}

      {request && (
        <VerifyEmailDialog
          request={request}
          isOpen={requestToVerify?.id === request.id}
          onClose={(_) => setRequestToVerify(null)}
        />
      )}

      <ConfirmDeleteDialog
        email={email}
        request={request}
        isOpen={
          emailToDelete != null &&
          (emailToDelete.id === email?.id || emailToDelete.id === request?.id)
        }
        onClose={(_) => setEmailToDelete(null)}
      />
    </>
  );
}
