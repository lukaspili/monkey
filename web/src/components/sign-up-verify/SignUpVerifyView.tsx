import { Strong, Text } from "@/catalyst/text";
import { FormView } from "@/components/sign-up-verify/FormView";
import { SignUpRequest } from "@/models/sign-up-request";

export function SignUpVerifyView({ request }: { request: SignUpRequest }) {
  console.log(request);
  return (
    <section>
      <div>
        <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-zinc-950 dark:text-white">
          Welcome aboard, {request.name}!
        </h2>
        <Text className="mt-2">
          We've sent you a verification code to confirm it's really you. Please check your inbox at{" "}
          <Strong>{request.emailVerificationRequest.email}</Strong>.
        </Text>
      </div>
      <div className="mt-8">
        <div>
          <FormView request={request} />
        </div>
      </div>
    </section>
  );
}
