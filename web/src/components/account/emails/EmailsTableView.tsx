import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
} from "@/catalyst/dropdown";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/catalyst/table";
import { ConfirmDeleteButton } from "@/components/account/emails/ConfirmDeleteButton";
import { EmailsTableRow } from "@/components/account/emails/EmailsTableRow";
import { getUserEmailRequests, getUserEmails } from "@/data/session";
import { UserEmail, UserEmailRequest } from "@/models/user";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";

export async function EmailsTableView() {
  const userEmails = await getUserEmails();
  const emailRequests = await getUserEmailRequests();

  const rows = [
    ...userEmails.map((email) => ({
      key: `email-${email.id}`,
      email: email,
      request: undefined,
    })),
    ...emailRequests.map((request) => ({
      key: `request-${request.id}`,
      email: undefined,
      request: request,
    })),
  ];

  return (
    <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]" bleed>
      <TableHead>
        <TableRow>
          <TableHeader>Email</TableHeader>
          <TableHeader>Status</TableHeader>

          <TableHeader className="relative w-0"></TableHeader>
          <TableHeader className="relative w-0">
            <span className="sr-only">Actions</span>
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <EmailsTableRow key={row.key} email={row.email} request={row.request} />
        ))}
      </TableBody>
    </Table>
  );
}

function EmailDropdown({ email }: { email: UserEmail }) {
  return (
    <Dropdown>
      <DropdownButton plain aria-label="More options">
        <EllipsisHorizontalIcon />
      </DropdownButton>
      <DropdownMenu anchor="bottom end">
        <DropdownItem disabled>Make Primary</DropdownItem>
        <DropdownItem disabled>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function EmailRequestDropdown({ request }: { request: UserEmailRequest }) {
  return (
    <Dropdown>
      <DropdownButton plain aria-label="More options">
        <EllipsisHorizontalIcon />
      </DropdownButton>
      <DropdownMenu anchor="bottom end" className="min-w-48">
        <DropdownHeader>
          <div className="pr-6">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {request.emailVerificationRequest.email}
            </div>
          </div>
        </DropdownHeader>
        <DropdownDivider />
        <ConfirmDeleteButton request={request} />
      </DropdownMenu>
    </Dropdown>
  );
}
