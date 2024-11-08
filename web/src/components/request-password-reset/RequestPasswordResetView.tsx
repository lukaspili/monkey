import { Link } from "@/catalyst/link";
import { Strong, Text } from "@/catalyst/text";
import { FormView } from "@/components/request-password-reset/FormView";
import { ChevronLeftIcon } from "@heroicons/react/16/solid";

export function RequestPasswordResetView() {
  return (
    <section>
      <div>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-zinc-950 dark:text-white">
          Forgot your password?
        </h2>
        <Text className="-ml-1">
          <Strong>
            <Link href="/sign-in" className="flex flex-row items-center">
              <ChevronLeftIcon className="size-4" /> Back to login
            </Link>
          </Strong>
        </Text>
      </div>
      <div className="mt-5">
        <div>
          <FormView />
        </div>
      </div>
    </section>
  );
}
