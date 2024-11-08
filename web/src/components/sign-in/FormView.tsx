"use client";

import { signIn } from "@/actions/session";
import { Button } from "@/catalyst/button";
import { ErrorMessage, Field, Label } from "@/catalyst/fieldset";
import { Input } from "@/catalyst/input";
import FormErrorView from "@/components/shared/FormErrorView";
import { valibotResolver } from "@hookform/resolvers/valibot";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
import * as v from "valibot";

const FormSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email("Please enter your email address.")),
  password: v.pipe(v.string(), v.minLength(1, "Please enter your password.")),
});

type FormValues = v.InferOutput<typeof FormSchema>;

export default function FormView() {
  const form = useForm<FormValues>({
    resolver: valibotResolver(FormSchema),
    mode: "all",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
  });

  const [response, action, pending] = useActionState(signIn, null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    form.setValue("email", "alice@a.com");
    form.setValue("password", "FooBar123");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <div>
          <PasswordView />
        </div>
        <div>
          <RecoverPasswordView />
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

function PasswordView() {
  const name = "password";
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState<FormValues>({ name });
  const error = errors[name];

  return (
    <Field>
      <Label>Password</Label>
      <Input
        {...register(name)}
        type="password"
        autoComplete="current-password"
        invalid={error != undefined}
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
  );
}

function RecoverPasswordView() {
  return (
    <div className="flex items-center justify-end">
      <div className="text-sm leading-6">
        <Link
          href="/password"
          className="font-semibold text-zinc-950 hover:text-zinc-700 dark:text-white dark:hover:text-zinc-300"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" color="dark/white" disabled={pending}>
      Sign In
    </Button>
  );
}
