import { Divider } from "@/catalyst/divider";
import { AvatarView } from "@/components/account/avatar/AvatarView";
import { ChangePasswordView } from "@/components/account/change-password/ChangePasswordView";
import { EmailsView } from "@/components/account/emails/EmailsView";
import DisplayNameView from "@/components/account/name/DisplayNameView";
import { PageHeading } from "@/components/shared/PageHeading";

export default function AccountView() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* <Heading>Account</Heading> */}
      <PageHeading>Account</PageHeading>
      <Divider className="my-10 mt-6" />

      <section>
        <AvatarView />
      </section>

      <section className="mt-12">
        <DisplayNameView />
      </section>

      <section className="mt-12">
        <EmailsView />
      </section>

      <section className="mt-12">
        <ChangePasswordView />
      </section>
    </div>
  );
}
