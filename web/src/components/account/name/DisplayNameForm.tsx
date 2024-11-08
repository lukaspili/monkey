"use client";

import { updateUserName } from "@/actions/session/account";
import { ErrorMessage, Field, FieldGroup, Fieldset } from "@/catalyst/fieldset";
import { Input } from "@/catalyst/input";
import { Text } from "@/catalyst/text";
import { ActionButton } from "@/components/shared/ActionButton";
import { ApiResponse } from "@/lib/api";
import { SessionUser } from "@/models/user";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Heading } from "catalyst/heading";
import clsx from "clsx";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";

const FormSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1, "Please enter your name.")),
});

type FormValues = v.InferOutput<typeof FormSchema>;

const fieldName = "name";

export default function DisplayNameForm({ user }: { user: SessionUser }) {
  const form = useForm<FormValues>({
    resolver: valibotResolver(FormSchema),
    mode: "all",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
    defaultValues: {
      name: user.name,
    },
  });

  const [response, action, pending] = useActionState(updateUserName, null);

  useEffect(() => {
    if (!response) {
      return;
    }

    if (response.successful) {
      toast.success("Your name has been updated.");
    } else {
      toast.error(response.errors[0]);
    }
  }, [response]);

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
      <Heading level={2}>Display Name</Heading>
      <Text>Other users will see this name on your profile.</Text>
      <div className="mt-6">
        <Fieldset aria-label="Display Name">
          <FieldGroup>
            <FieldView />
          </FieldGroup>
        </Fieldset>
      </div>
    </div>
  );
}

function FieldView() {
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState<FormValues>({ name: fieldName });
  const error = errors[fieldName];

  return (
    <Field>
      <Input
        {...register(fieldName)}
        type="text"
        autoComplete="name"
        invalid={error != undefined}
        className="max-w-96"
      />
      {/* {error && <ErrorMessage>{error.message}</ErrorMessage>} */}
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
  const { errors } = useFormState<FormValues>({ name: fieldName });
  const formError = errors[fieldName];

  let message: string | undefined = undefined;
  let isErrorStyle!: boolean;

  if (pending) {
    message = undefined;
    isErrorStyle = false;
  } else if (formError) {
    message = formError.message;
    isErrorStyle = true;
  } else if (response && response.hasErrors) {
    message = response.errors[0];
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

function ErrorView({ response }: { response: ApiResponse | null }) {
  const { errors } = useFormState<FormValues>({ name: fieldName });
  const formError = errors[fieldName];

  let message: string | undefined = undefined;

  if (response && response.hasErrors) {
    message = response.errors[0];
  } else if (formError) {
    message = formError.message;
  }

  return (
    <ErrorMessage className={clsx(message != undefined ? "block" : "hidden")}>
      {message}
    </ErrorMessage>
  );
}
