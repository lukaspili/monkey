import { ChangePasswordForm } from "@/components/account/change-password/ChangePasswordForm";

export function ChangePasswordView() {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-950/10">
      <ChangePasswordForm />
    </div>

    // <form method="post">
    //   <Heading level={2}>Change Password</Heading>
    // <Text>
    //   New password will be effective immediately. All active sessions except this one will be
    //   terminated by precaution.
    // </Text>
    //   {/* <Divider className="my-5 mt-6" /> */}

    // <Fieldset aria-label="Change password">
    //   <FieldGroup>
    //     <Field>
    //       <Label>Current Password</Label>
    //       <Input name="street_address" />
    //     </Field>
    //     <Field>
    //       <Label>New Password</Label>
    //       <Input name="street_address" />
    //     </Field>
    //   </FieldGroup>
    // </Fieldset>

    //   {/* <div className="flex flex-col gap-6">
    //     <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
    //       <div className="space-y-1">
    //         <Subheading>Current Password</Subheading>
    //         <Text>This will be displayed on your public profile.</Text>
    //       </div>
    //       <div>
    //         <Input aria-label="Name" name="name" defaultValue="Catalyst" />
    //       </div>
    //     </section>

    //     <Divider className="my-5" soft />

    //     <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
    //       <div className="space-y-1">
    //         <Subheading>New Password</Subheading>
    //         <Text>The new password will take effect immediately.</Text>
    //       </div>
    //       <div>
    //         <Input aria-label="Name" name="name" defaultValue="Catalyst" />
    //       </div>
    //     </section>
    //   </div> */}

    //   <div className="mt-6 flex justify-end gap-4">
    //     <Button type="submit">Save</Button>
    //   </div>
    // </form>
  );
}
