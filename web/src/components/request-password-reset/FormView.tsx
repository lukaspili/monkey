"use client";

import { requestUserPasswordReset } from "@/actions/passwords";
import { Button } from "@/catalyst/button";
import { ErrorMessage, Field, Label } from "@/catalyst/fieldset";
import { Input } from "@/catalyst/input";
import FormErrorView from "@/components/shared/FormErrorView";
import { ApiResponse } from "@/lib/api";
import { ResetUserPasswordRequest } from "@/models/reset-user-password-request";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Strong, Text } from "catalyst/text";
import clsx from "clsx";
import { startTransition, useActionState, useRef } from "react";
import { FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
import * as v from "valibot";

const FormSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email("Please enter your email address.")),
});

type FormValues = v.InferOutput<typeof FormSchema>;

export function FormView() {
  const [response, action, pending] = useActionState(requestUserPasswordReset, null);

  return (
    <div>
      <div className={clsx(response?.successful && "hidden")}>
        <div>
          <Text>Enter your email address and we'll send you a link to reset your password.</Text>
        </div>

        <div className="mt-5">
          <FormContentView response={response} pending={pending} action={action} />
        </div>
      </div>
      <div className={clsx(response?.successful !== true && "hidden")}>
        <p>
          We've sent you instructions to reset your password. Please check your inbox at{" "}
          <Strong>{response?.data?.email}</Strong>.
        </p>
      </div>
    </div>
  );
}

function FormContentView({
  response,
  pending,
  action,
}: {
  response: ApiResponse<ResetUserPasswordRequest> | null;
  pending: boolean;
  action: (payload: FormData) => void;
}) {
  const form = useForm<FormValues>({
    resolver: valibotResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <FormProvider {...form}>
      <form
        ref={formRef}
        className="space-y-6"
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            startTransition(() => {
              action(new FormData(formRef.current!));
            });
          })(evt);
        }}
      >
        {!pending && response && response.failed && (
          <div>
            <FormErrorView errors={response.errors} />
          </div>
        )}
        <div>
          <EmailView />
        </div>
        <div className="flex flex-col items-stretch">
          <SubmitButton pending={pending} />
        </div>
      </form>
    </FormProvider>
  );
}

function EmailView() {
  const name = "email";
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState<FormValues>({ name });
  const error = errors[name];

  return (
    <Field>
      <Label>Email address</Label>
      <Input {...register(name)} type="email" autoComplete="email" invalid={error != undefined} />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" color="dark/white" disabled={pending}>
      Submit
    </Button>
  );
}
