import { Heading } from "@/catalyst/heading";
import { Text } from "@/catalyst/text";
import { AddEmailButton } from "@/components/account/emails/AddEmailButton";
import { EmailsTableView } from "@/components/account/emails/EmailsTableView";

export function EmailsView() {
  // const newEmailRequestToVerify = useAtom(newEmailRequestToVerifyAtom);

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-950/10">
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <Heading level={2}>Email Address</Heading>
        <Text>
          Enter the email addresses you want to use to log in with Vercel. Your primary email will
          be used for account-related notifications.
        </Text>
        <div className="mt-3">
          <EmailsTableView />
        </div>
        <div className="mt-6">
          <AddEmailButton />
        </div>
      </div>
      <div className="border-t border-zinc-950/5 bg-zinc-50 px-4 py-3 sm:px-6">
        <div className="flex gap-4">
          <Text>
            Emails must be verified to be able to login with them or be used as primary email.
          </Text>
        </div>
      </div>
    </div>
  );
}
