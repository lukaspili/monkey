"use client";

import { resetUserPassword } from "@/actions/passwords";
import { Button } from "@/catalyst/button";
import { ErrorMessage, Field, Label } from "@/catalyst/fieldset";
import { Input } from "@/catalyst/input";
import FormErrorView from "@/components/shared/FormErrorView";
import { ApiResponse } from "@/lib/api";
import { ResetUserPasswordRequest } from "@/models/reset-user-password-request";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { startTransition, useActionState, useRef, useState } from "react";
import { FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
import * as v from "valibot";

const FormSchema = v.object({
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

export function FormView({ slug, token }: { slug: string; token: string }) {
  const actionWithSlug = resetUserPassword.bind(null, slug);
  const [response, action, pending] = useActionState(actionWithSlug, null);

  return <FormContentView token={token} response={response} pending={pending} action={action} />;
}

function FormContentView({
  token,
  response,
  pending,
  action,
}: {
  token: string;
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
        <input type="hidden" name="token" value={token} />

        {!pending && response && response.failed && (
          <div>
            <FormErrorView errors={response.errors} />
          </div>
        )}
        <div>
          <PasswordView />
        </div>
        <div className="flex flex-col items-stretch">
          <SubmitButton pending={pending} />
        </div>
      </form>
    </FormProvider>
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
      Update
    </Button>
  );
}
