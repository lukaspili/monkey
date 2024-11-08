"use client";

import { removeUserAvatar, updateUserAvatar } from "@/actions/session/avatar";
import { Text } from "@/catalyst/text";
import { AvatarInput, AvatarInputController } from "@/components/account/avatar/AvatarInput";
import { ActionButton } from "@/components/shared/ActionButton";
import { ApiResponse } from "@/lib/api";
import { SessionUser } from "@/models/user";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button } from "catalyst/button";
import { Heading } from "catalyst/heading";
import clsx from "clsx";
import { RefObject, startTransition, useActionState, useEffect, useRef } from "react";
import { FormProvider, useForm, useFormState, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";

const fieldName = "uploadId";
const FormSchema = v.object({
  [fieldName]: v.pipe(v.string(), v.nonEmpty("Something went wrong. Please try again.")),
});

export type FormValues = v.InferOutput<typeof FormSchema>;

export function AvatarForm({ user }: { user: SessionUser }) {
  const form = useForm<FormValues>({
    resolver: valibotResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldUseNativeValidation: false,
  });

  const [response, action, pending] = useActionState(updateUserAvatar, null);

  useEffect(() => {
    if (!response) {
      return;
    }

    if (response.successful) {
      toast.success("Your avatar has been updated.");
    } else {
      toast.error(response.simpleError);
    }
  }, [response]);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<AvatarInputController>(null);

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
        <ContentView user={user} inputRef={inputRef} />
        <FooterView
          user={user}
          pending={pending}
          response={response}
          onRevert={() => {
            inputRef.current?.revert();
          }}
          onToggleDisabled={(disabled) => {
            inputRef.current?.toggleDisabled(disabled);
          }}
        />
      </form>
    </FormProvider>
  );
}
function ContentView({ inputRef, user }: { inputRef: RefObject<any>; user: SessionUser }) {
  return (
    <div className="flex flex-row gap-8 px-4 py-5 sm:px-6 sm:pb-1 sm:pt-6">
      <div className="flex-1">
        <Heading level={2}>Avatar</Heading>
        <Text>Click on the avatar to upload a new one from your files.</Text>
      </div>
      <div className="flex-shrink-0">
        <AvatarInput ref={inputRef} name={fieldName} user={user} />
      </div>
    </div>
  );
}

function FooterView({
  user,
  pending,
  response,
  onRevert,
  onToggleDisabled,
}: {
  user: SessionUser;
  pending: boolean;
  response: ApiResponse | null;
  onRevert: () => void;
  onToggleDisabled: (disabled: boolean) => void;
}) {
  return (
    <div className="border-t border-zinc-950/5 bg-zinc-50 px-4 py-3 sm:px-6">
      <div className="flex flex-row gap-4">
        <div className="flex flex-1 items-center">
          <StatusView pending={pending} response={response} />
        </div>
        <Buttons
          user={user}
          pending={pending}
          onRevert={onRevert}
          onToggleDisabled={onToggleDisabled}
        />
      </div>
    </div>
  );
}

function Buttons({
  user,
  pending,
  onRevert,
  onToggleDisabled,
}: {
  user: SessionUser;
  pending: boolean;
  onRevert: () => void;
  onToggleDisabled: (disabled: boolean) => void;
}) {
  return (
    <div className="flex flex-row gap-2">
      <RevertButton pending={pending} onRevert={onRevert} />
      <SubmitButton pending={pending} />
      <DeleteCurrentButton user={user} onToggleDisabled={onToggleDisabled} />
    </div>
  );
}

function RevertButton({ pending, onRevert }: { pending: boolean; onRevert: () => void }) {
  const value: string | undefined = useWatch<FormValues>({ name: fieldName });
  const hasNewFile = value !== undefined;

  return (
    <Button
      className={clsx(!hasNewFile && "invisible")}
      plain={true}
      disabled={pending}
      onClick={() => onRevert()}
    >
      Discard
    </Button>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  const value: string | undefined = useWatch<FormValues>({ name: fieldName });
  const hasNewFile = value !== undefined;

  return (
    <ActionButton className={clsx(!hasNewFile && "invisible")} type="submit" inProgress={pending}>
      Save
    </ActionButton>
  );
}

function DeleteCurrentButton({
  user,
  onToggleDisabled,
}: {
  user: SessionUser;
  onToggleDisabled: (disabled: boolean) => void;
}) {
  // const filePond = useFilePond();
  // const setFilePondDisabled = useFilePondDisabledToggle();

  const [response, action, pending] = useActionState(removeUserAvatar, null);

  useEffect(() => {
    if (!response) {
      return;
    }

    if (response.successful) {
      toast.success("Your avatar has been removed.");
    } else {
      toast.error(response.simpleError);
    }
  }, [response]);

  useEffect(() => {
    onToggleDisabled(pending);
  }, [pending]);

  const value: string | undefined = useWatch<FormValues>({ name: fieldName });
  const hasNewFile = value !== undefined;

  return (
    <ActionButton
      secondary={true}
      className={clsx((hasNewFile || !user.avatar) && "hidden")}
      type="submit"
      inProgress={pending}
      onClick={() => {
        action(new FormData());
      }}
    >
      Remove
    </ActionButton>
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
