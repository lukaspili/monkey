import { CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogFooter } from "@/components/ui/dialog";
import { AppDialog, DialogTitle } from "@/extralyst/dialog";

const users = [
  {
    name: "Olivia Martin",
    email: "m@example.com",
    avatar: "/avatars/01.png",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "/avatars/03.png",
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "/avatars/05.png",
  },
  {
    name: "Jackson Lee",
    email: "lee@example.com",
    avatar: "/avatars/02.png",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    avatar: "/avatars/04.png",
  },
] as const;

type User = (typeof users)[number];

export function NewExpenseDialog2({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (value: boolean) => void;
}) {
  // const [open, setOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([]);

  return (
    <AppDialog size="xl" open={isOpen} onClose={onClose}>
      <DialogTitle>Add Expense</DialogTitle>
      {/* <DialogContent className="gap-0 p-0 outline-none">
        <DialogHeader className="px-4 pb-4 pt-5">
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>Select who is participating in this expense.</DialogDescription>
        </DialogHeader> */}
      <Command className="overflow-hidden rounded-t-none border-t bg-transparent">
        <CommandInput placeholder="Search user..." className="border-none focus:ring-0" />
        <CommandList>
          <CommandEmpty>No users found.</CommandEmpty>
          <CommandGroup className="p-2">
            {users.map((user) => (
              <CommandItem
                key={user.email}
                className="flex items-center px-2"
                onSelect={() => {
                  if (selectedUsers.includes(user)) {
                    return setSelectedUsers(
                      selectedUsers.filter((selectedUser) => selectedUser !== user)
                    );
                  }

                  return setSelectedUsers(
                    [...users].filter((u) => [...selectedUsers, user].includes(u))
                  );
                }}
              >
                <Avatar>
                  <AvatarImage src={user.avatar} alt="Image" />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
                {selectedUsers.includes(user) ? (
                  <CheckIcon className="text-primary ml-auto flex h-5 w-5" />
                ) : null}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
        {selectedUsers.length > 0 ? (
          <div className="flex -space-x-2 overflow-hidden">
            {selectedUsers.map((user) => (
              <Avatar key={user.email} className="border-background inline-block border-2">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Select users to add to this thread.</p>
        )}
        <Button
          disabled={selectedUsers.length < 2}
          onClick={() => {
            // setOpen(false);
          }}
        >
          Continue
        </Button>
      </DialogFooter>
    </AppDialog>
  );
}
