import { Button } from "@/catalyst/button";
import { Divider } from "@/catalyst/divider";
import { Heading, Subheading } from "@/catalyst/heading";
import { Input } from "@/catalyst/input";
import { Text } from "@/catalyst/text";

export default function ProfileAlternateView() {
  return (
    <form method="post">
      <Heading>Profile</Heading>
      <Divider className="my-10 mt-6" />

      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Name</Subheading>
          <Text>This will be displayed on your public profile.</Text>
        </div>
        <div>
          <Input aria-label="Name" name="name" defaultValue="John Doe" />
        </div>
      </section>

      <Divider className="my-10" soft />

      <div className="flex justify-end gap-4">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
