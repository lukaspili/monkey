import { deleteUserEmailRequest } from "@/actions/session/email-requests";
import { deleteUserEmail } from "@/actions/session/emails";
import { ActionButton } from "@/components/shared/ActionButton";
import FormErrorView from "@/components/shared/FormErrorView";
import { AppDialog, DialogActions, DialogBody, DialogTitle } from "@/extralyst/dialog";
import { ApiResponse } from "@/lib/api";
import { UserEmail, UserEmailRequest } from "@/models/user";
import { useClose } from "@headlessui/react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button } from "catalyst/button";
import { Strong } from "catalyst/text";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as v from "valibot";

const FormSchema = v.object({});

type FormValues = v.InferOutput<typeof FormSchema>;

export function ConfirmDeleteDialog({
  email,
  request,
  isOpen,
  onClose,
}: {
  email?: UserEmail;
  request?: UserEmailRequest;
  isOpen: boolean;
  onClose: (value: boolean) => void;
}) {
  return (
    <AppDialog size="lg" open={isOpen} onClose={onClose}>
      <DialogTitle>Delete Email</DialogTitle>
      <ContentView email={email} request={request} />
    </AppDialog>
  );
}

function ContentView({ email, request }: { email?: UserEmail; request?: UserEmailRequest }) {
  const form = useForm<FormValues>({
    resolver: valibotResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
  });

  const emailLabel = email ? email.email : request!.emailVerificationRequest.email;

  const deleteAction = email
    ? deleteUserEmail.bind(null, email!.id)
    : deleteUserEmailRequest.bind(null, request!.slug);
  const [response, action, pending] = useActionState(deleteAction, null);

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
            Are you sure you want to remove <Strong>{emailLabel}</Strong> from your account?
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
