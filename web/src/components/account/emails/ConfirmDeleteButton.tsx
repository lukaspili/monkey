"use client";

import { emailToDeleteAtom } from "@/components/account/emails/EmailTableRowDialogsView";
import { UserEmail, UserEmailRequest } from "@/models/user";
import { DropdownItem } from "catalyst/dropdown";
import clsx from "clsx";
import { useSetAtom } from "jotai";

export function ConfirmDeleteButton({
  email,
  request,
}: {
  email?: UserEmail;
  request?: UserEmailRequest;
}) {
  const setEmailToDelete = useSetAtom(emailToDeleteAtom);
  const value = (email ?? request)!;
  const disabled = email?.isPrimary ?? false;

  return (
    <DropdownItem
      className={clsx("data-[focus]:bg-gray-100", { "opacity-50": disabled })}
      disabled={disabled}
      onClick={() => setEmailToDelete(value)}
    >
      <span className="text-red-600">Delete</span>
    </DropdownItem>
  );
}
