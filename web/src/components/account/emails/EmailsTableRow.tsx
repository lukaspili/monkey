import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownHeader,
  DropdownMenu,
} from "@/catalyst/dropdown";
import { TableCell, TableRow } from "@/catalyst/table";
import { ConfirmDeleteButton } from "@/components/account/emails/ConfirmDeleteButton";
import { EmailsTableRowDialogs } from "@/components/account/emails/EmailTableRowDialogsView";
import { MakePrimaryButton } from "@/components/account/emails/MakePrimaryButton";
import { VerifyEmailButton } from "@/components/account/emails/VerifyEmailButton";
import { UserEmail, UserEmailRequest } from "@/models/user";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import { Badge } from "catalyst/badge";
import clsx from "clsx";

export async function EmailsTableRow({
  email,
  request,
}: {
  email?: UserEmail;
  request?: UserEmailRequest;
}) {
  const emailValue = email != null ? email.email : request!.emailVerificationRequest.email;
  const verified = email != null ? true : false;
  const isPrimary = email?.isPrimary ?? false;

  return (
    <TableRow>
      <TableCell className="font-medium">{emailValue}</TableCell>
      <TableCell>
        <div className="flex gap-2.5">
          <Badge className={clsx({ hidden: !isPrimary })} color="blue">
            Primary
          </Badge>
          <Badge className={clsx({ hidden: !verified })} color="lime">
            Verified
          </Badge>
          <Badge className={clsx({ hidden: verified })} color="orange">
            Unverified
          </Badge>
        </div>
      </TableCell>
      <TableCell>{request && <VerifyEmailButton request={request} />}</TableCell>
      <TableCell>
        <div className="-mx-3 -my-1.5 sm:-mx-2.5">
          {request ? <EmailRequestDropdown request={request} /> : <EmailDropdown email={email!} />}
        </div>

        {/* Make dialogs a descendant of a cell because it cannot be a descendant of a row (<tr>) or a table body (<tbody>)  */}
        <EmailsTableRowDialogs email={email} request={request} />
      </TableCell>
    </TableRow>
  );
}

function EmailDropdown({ email }: { email: UserEmail }) {
  return (
    <Dropdown>
      <DropdownButton plain aria-label="More options">
        <EllipsisHorizontalIcon />
      </DropdownButton>
      <DropdownMenu anchor="bottom end" className="min-w-48">
        <DropdownHeader>
          <div className="pr-6">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">{email.email}</div>
          </div>
        </DropdownHeader>
        <DropdownDivider />
        <MakePrimaryButton email={email} />
        <ConfirmDeleteButton email={email} />
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
