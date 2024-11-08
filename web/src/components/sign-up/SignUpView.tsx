import { Link } from "@/catalyst/link";
import { Strong, Text } from "@/catalyst/text";
import FormView from "@/components/sign-up/FormView";

export default function SignUpView() {
  return (
    <section>
      <div>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-zinc-950 dark:text-white">
          On the money trail.
          <br /> Get started now. It's free.
        </h2>
        <Link href="/sign-in">
          <Text>
            Already a member? <Strong>Sign in</Strong>
          </Text>
        </Link>
      </div>
      <div className="mt-10">
        <div>
          <FormView />
        </div>
      </div>
      {/* <CodeDialog /> */}
    </section>
  );
}
