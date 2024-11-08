import { createAddUserEmailRequest } from "@/actions/session/email-requests";
import { requestToVerifyAtom } from "@/components/account/emails/EmailTableRowDialogsView";
import { ActionButton } from "@/components/shared/ActionButton";
import FormErrorView from "@/components/shared/FormErrorView";
import { AppDialog, DialogActions, DialogBody, DialogTitle } from "@/extralyst/dialog";
import { ApiResponse } from "@/lib/api";
import { useClose } from "@headlessui/react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button } from "catalyst/button";
import { ErrorMessage, Field, Label } from "catalyst/fieldset";
import { Input } from "catalyst/input";
import { useSetAtom } from "jotai";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
import * as v from "valibot";

const FormSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email("Please enter a valid email address.")),
});

type FormValues = v.InferOutput<typeof FormSchema>;

export function AddEmailDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (value: boolean) => void;
}) {
  return (
    <AppDialog size="xl" open={isOpen} onClose={onClose}>
      <DialogTitle>Add Email</DialogTitle>
      <ContentView />
    </AppDialog>
  );
}

function ContentView() {
  const form = useForm<FormValues>({
    resolver: valibotResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
  });

  const [response, action, pending] = useActionState(createAddUserEmailRequest, null);

  const close = useClose();

  const setEmailRequestToVerify = useSetAtom(requestToVerifyAtom);

  useEffect(() => {
    if (!response) {
      return;
    }

    if (response.successful) {
      close();
      setEmailRequestToVerify(response.data);
    }
  }, [response, close, setEmailRequestToVerify]);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <FormProvider {...form}>
      <form
        ref={formRef}
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            startTransition(() => {
              action(new FormData(formRef.current!));
            });
          })(evt);
        }}
      >
        <DialogBody>
          <p className="mt-4">
            Add a new email address to your account. This email, once verified, can be used to login
            to your account.
          </p>

          <div className="mt-6">
            <FormContentView response={response} pending={pending} />
          </div>
        </DialogBody>
        <DialogActions>
          <CloseButton />
          <SubmitButton pending={pending} />
        </DialogActions>
      </form>
    </FormProvider>
  );
}

function FormContentView({
  response,
  pending,
}: {
  response: ApiResponse | null;
  pending: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      {!pending && response && response.failed && (
        <div>
          <FormErrorView errors={response.errors} />
        </div>
      )}

      <EmailField />
    </div>
  );
}

function EmailField() {
  const name = "email";
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState<FormValues>({ name });
  const error = errors[name];

  return (
    <Field>
      <Label>Email</Label>
      <Input
        {...register(name)}
        type="email"
        autoComplete="email"
        invalid={error != undefined}
        autoFocus
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
  );
}

function CloseButton() {
  const close = useClose();
  return (
    <Button plain onClick={close}>
      Cancel
    </Button>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <ActionButton type="submit" inProgress={pending}>
      Add
    </ActionButton>
  );
}
