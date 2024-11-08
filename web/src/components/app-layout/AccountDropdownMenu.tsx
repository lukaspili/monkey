"use client";

import { signOut } from "@/actions/session";
import { DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu } from "@/catalyst/dropdown";
import { ArrowRightStartOnRectangleIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import { useTransition } from "react";

export default function AccountDropdownMenu({ anchor }: { anchor: "top start" | "bottom end" }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="/account">
        <UserCircleIcon />
        <DropdownLabel>Account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      {/* <DropdownItem href="#">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider /> */}
      <SignOutItem />
    </DropdownMenu>
  );
}

function SignOutItem() {
  const [isPending, startTransition] = useTransition();

  const onClickSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <DropdownItem onClick={onClickSignOut} disabled={isPending}>
      <ArrowRightStartOnRectangleIcon />
      <DropdownLabel>Sign Out</DropdownLabel>
    </DropdownItem>
  );
}
