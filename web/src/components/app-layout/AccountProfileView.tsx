"use server";

import { Avatar } from "@/catalyst/avatar";
import { getSessionUser } from "@/data/session";

export default async function AccountProfileView() {
  const user = await getSessionUser();
  const avatar = user.avatar?.url;

  return (
    <span className="flex min-w-0 items-center gap-3">
      <Avatar initials={user.initials} src={avatar} className="size-10" square alt="" />
      <span className="min-w-0">
        <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
          {user.name}
        </span>
        <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
          {user.primaryEmail.email}
        </span>
      </span>
    </span>
  );
}
