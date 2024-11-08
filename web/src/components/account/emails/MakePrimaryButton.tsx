"use client";

import { emailToMakePrimaryAtom } from "@/components/account/emails/EmailTableRowDialogsView";
import { UserEmail } from "@/models/user";
import { DropdownItem } from "catalyst/dropdown";
import clsx from "clsx";
import { useSetAtom } from "jotai";

export function MakePrimaryButton({ email }: { email: UserEmail }) {
  const setEmailToDelete = useSetAtom(emailToMakePrimaryAtom);
  const disabled = email.isPrimary;

  return (
    <DropdownItem
      className={clsx("data-[focus]:bg-gray-100", { "opacity-50": disabled })}
      disabled={disabled}
      onClick={() => setEmailToDelete(email)}
    >
      <span className="text-zinc-950">Make Primary</span>
    </DropdownItem>
  );
}
