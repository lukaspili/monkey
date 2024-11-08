import { Link } from "@/catalyst/link";
import { Strong, Text } from "@/catalyst/text";
import FormView from "@/components/sign-in/FormView";

export default function SignInView() {
  return (
    <section>
      <div>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-zinc-950 dark:text-white">
          Follow the money trail.
        </h2>
        <Text>
          Not a member?{" "}
          <Strong>
            <Link href="/sign-up">Create your account first</Link>
          </Strong>
        </Text>
      </div>
      <div className="mt-10">
        <div>
          <FormView />
        </div>
      </div>
    </section>
  );
}
