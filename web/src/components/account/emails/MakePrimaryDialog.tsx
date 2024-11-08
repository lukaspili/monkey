import { makeUserEmailPrimary } from "@/actions/session/emails";
import { ActionButton } from "@/components/shared/ActionButton";
import FormErrorView from "@/components/shared/FormErrorView";
import { AppDialog, DialogActions, DialogBody, DialogTitle } from "@/extralyst/dialog";
import { ApiResponse } from "@/lib/api";
import { UserEmail } from "@/models/user";
import { useClose } from "@headlessui/react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button } from "catalyst/button";
import { Strong } from "catalyst/text";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as v from "valibot";

const FormSchema = v.object({});

type FormValues = v.InferOutput<typeof FormSchema>;

export function MakePrimaryDialog({
  email,
  isOpen,
  onClose,
}: {
  email: UserEmail;
  isOpen: boolean;
  onClose: (value: boolean) => void;
}) {
  return (
    <AppDialog size="xl" open={isOpen} onClose={onClose}>
      <DialogTitle>Change Primary Email</DialogTitle>
      <ContentView email={email} />
    </AppDialog>
  );
}

function ContentView({ email }: { email: UserEmail }) {
  const form = useForm<FormValues>({
    resolver: valibotResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
  });

  const actionWithParams = makeUserEmailPrimary.bind(null, email.id);
  const [response, action, pending] = useActionState(actionWithParams, null);

  const close = useClose();

  useEffect(() => {
    if (!response) {
      return;
    }

    if (response.successful) {
      close();
    }
  }, [response, close]);

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
            Are you sure you want to make <Strong>{email.email}</Strong> your primary email? All
            communication and notifications will be sent to this email only.
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
    </div>
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
      Confirm
    </ActionButton>
  );
}
