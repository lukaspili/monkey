import { Link } from "@/catalyst/link";
import { Strong, Text } from "@/catalyst/text";
import { FormView } from "@/components/reset-user-password/FormView";

export async function ResetUserPasswordView({ slug, token }: { slug: string; token: string }) {
  return (
    <section>
      <div>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-zinc-950 dark:text-white">
          Reset your password
        </h2>
        <Text>
          Changed your mind?{" "}
          <Strong>
            <Link href="/sign-in">Go to login</Link>
          </Strong>
        </Text>
      </div>
      <div className="mt-5">
        <Text>Please enter a new password, which you can use to sign in immediately.</Text>
      </div>
      <div className="mt-5">
        <div>
          <FormView slug={slug} token={token} />
        </div>
      </div>
    </section>
  );
}
