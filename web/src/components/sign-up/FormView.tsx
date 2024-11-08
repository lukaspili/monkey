"use client";

import { createSignUpRequest } from "@/actions/sign-up";
import { Button } from "@/catalyst/button";
import { ErrorMessage, Field, Label } from "@/catalyst/fieldset";
import { Input } from "@/catalyst/input";
import { Text, TextLink } from "@/catalyst/text";
import FormErrorView from "@/components/shared/FormErrorView";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
import * as v from "valibot";

const FormSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(2, "Please enter your name.")),
  email: v.pipe(v.string(), v.trim(), v.email("Please enter a valid email address.")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Please enter a longer, more secure password."),
    v.maxLength(100, "This is unreasonnable."),
    v.regex(/[a-z]/, "Please include a lowercase letter."),
    v.regex(/[A-Z]/, "Please include an uppercase letter."),
    v.regex(/[0-9]/, "Please include a number.")
  ),
});

type FormValues = v.InferOutput<typeof FormSchema>;

export default function FormView() {
  const form = useForm<FormValues>({
    resolver: valibotResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
  });

  const [response, action, pending] = useActionState(createSignUpRequest, null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    form.setValue("name", "John Doe");
    form.setValue("email", "john@doe.com");
    form.setValue("password", "Password123");
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
          <NameView />
        </div>
        <div>
          <EmailView />
        </div>
        <div>
          <PasswordView />
        </div>
        <div className="flex flex-col items-stretch">
          <SubmitButton pending={pending} />
        </div>
        <div>
          <LegalView />
        </div>
      </form>
    </FormProvider>
  );
}

function NameView() {
  const name = "name";
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState<FormValues>({ name });
  const error = errors[name];

  return (
    <Field>
      <Label>Name</Label>
      <Input {...register(name)} type="text" autoComplete="name" invalid={error != undefined} />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
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

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const type = showPassword ? "text" : "password";

  return (
    <Field>
      <div className="mb-1.5 flex items-center justify-between">
        {/* redeclare `font-medium` because Field `[&>[data-slot=label]]:font-medium` is broken by parent div */}
        <Label className="font-medium">Password</Label>
        <Button className="app-button" plain onClick={toggleShowPassword}>
          {showPassword ? (
            <>
              <span className="font-normal">Hide</span> <EyeSlashIcon />
            </>
          ) : (
            <>
              <span className="font-normal">Reveal</span> <EyeIcon />
            </>
          )}
        </Button>
      </div>
      <Input
        {...register(name)}
        type={type}
        autoComplete="new-password"
        invalid={error != undefined}
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" color="dark/white" disabled={pending}>
      Sign Up
    </Button>
  );
}

function LegalView() {
  return (
    <Text className="text-center">
      By signing up you agree to our <TextLink href="#">terms of service</TextLink> and{" "}
      <TextLink href="#">privacy policy</TextLink>. We don't share nor sell your data.
    </Text>
  );
}
