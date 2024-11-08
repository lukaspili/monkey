"use client";

import { updateUserPassword } from "@/actions/session/account";
import { ErrorMessage, Field, FieldGroup, Fieldset, Label } from "@/catalyst/fieldset";
import { Input } from "@/catalyst/input";
import { Text } from "@/catalyst/text";
import { ActionButton } from "@/components/shared/ActionButton";
import { ApiResponse } from "@/lib/api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button } from "catalyst/button";
import { Heading } from "catalyst/heading";
import clsx from "clsx";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";

const FormSchema = v.pipe(
  v.object({
    currentPassword: v.pipe(v.string(), v.minLength(8, "Please enter your current password.")),
    newPassword: v.pipe(
      v.string(),
      v.minLength(8, "Please enter a longer, more secure password."),
      v.maxLength(100, "This is unreasonnable."),
      v.regex(/[a-z]/, "Please include a lowercase letter."),
      v.regex(/[A-Z]/, "Please include an uppercase letter."),
      v.regex(/[0-9]/, "Please include a number.")
    ),
  }),
  v.check(
    ({ currentPassword, newPassword }) => currentPassword !== newPassword,
    "The new password must be different."
  )
);

type FormValues = v.InferOutput<typeof FormSchema>;

export function ChangePasswordForm() {
  const form = useForm<FormValues>({
    resolver: valibotResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
  });

  const { reset } = form;

  const [response, action, pending] = useActionState(updateUserPassword, null);

  useEffect(() => {
    if (!response) {
      return;
    }

    if (response.successful) {
      toast.success("Your password has been updated.");
      reset();
    }
  }, [response, reset]);

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
        <ContentView />
        <FooterView pending={pending} response={response} />
      </form>
    </FormProvider>
  );
}
function ContentView() {
  return (
    <div className="px-4 py-5 sm:px-6 sm:pb-1 sm:pt-6">
      <Heading level={2}>Change Password</Heading>
      <Text>
        Enter your current and new desired password. The new password will take effect immediately.
      </Text>
      <div className="mt-6">
        <Fieldset aria-label="Display Name">
          <FieldGroup className="space-y-0">
            <CurrentPasswordField />
            <NewPasswordField />
          </FieldGroup>
        </Fieldset>
      </div>
    </div>
  );
}

function CurrentPasswordField() {
  const fieldName = "currentPassword";
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState<FormValues>({ name: fieldName });
  const error = errors[fieldName];

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const type = showPassword ? "text" : "password";

  return (
    <Field>
      <div className="mb-1.5 flex max-w-96 items-center justify-between">
        {/* redeclare `font-medium` because Field `[&>[data-slot=label]]:font-medium` is broken by parent div */}
        <Label className="font-medium">Current Password</Label>
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
        {...register(fieldName)}
        type={type}
        autoComplete="current-password"
        invalid={error != undefined}
        className="max-w-96"
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
  );
}

function NewPasswordField() {
  const fieldName = "newPassword";
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState<FormValues>({ name: fieldName });
  const error = errors[fieldName];

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const type = showPassword ? "text" : "password";

  return (
    <Field>
      <div className="mb-1.5 flex max-w-96 items-center justify-between">
        {/* redeclare `font-medium` because Field `[&>[data-slot=label]]:font-medium` is broken by parent div */}
        <Label className="font-medium">New Password</Label>
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
        {...register(fieldName)}
        type={type}
        autoComplete="new-password"
        invalid={error != undefined}
        className="max-w-96"
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
  );
}

function FooterView({ pending, response }: { pending: boolean; response: ApiResponse | null }) {
  return (
    <div className="border-t border-zinc-950/5 bg-zinc-50 px-4 py-3 sm:px-6">
      <div className="flex flex-row gap-4">
        <div className="flex flex-1 items-center">
          <StatusView pending={pending} response={response} />
        </div>
        <div>
          <ActionButton type="submit" inProgress={pending}>
            Save
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

function StatusView({ pending, response }: { pending: boolean; response: ApiResponse | null }) {
  let message: string | undefined;
  let isErrorStyle!: boolean;

  if (pending) {
    message = undefined;
    isErrorStyle = false;
  } else if (response?.failed) {
    message = response.simpleError;
    isErrorStyle = true;
  }

  return (
    <p
      className={clsx("text-base/6 sm:text-sm/6", message != undefined ? "block" : "hidden", {
        "text-red-600 dark:text-red-500": isErrorStyle,
        "text-zinc-500 dark:text-zinc-400": !isErrorStyle,
      })}
    >
      {message}
    </p>
  );
}
