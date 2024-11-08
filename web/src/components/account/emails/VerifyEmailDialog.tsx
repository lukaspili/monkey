import { verifyAddUserEmailRequest } from "@/actions/session/email-requests";
import { ActionButton } from "@/components/shared/ActionButton";
import FormErrorView from "@/components/shared/FormErrorView";
import { AppDialog, DialogActions, DialogBody, DialogTitle } from "@/extralyst/dialog";
import { ApiResponse } from "@/lib/api";
import { UserEmailRequest } from "@/models/user";
import { useClose } from "@headlessui/react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button } from "catalyst/button";
import { ErrorMessage, Field, Label } from "catalyst/fieldset";
import { Input } from "catalyst/input";
import { Strong, Text, TextLink } from "catalyst/text";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
import * as v from "valibot";

const FormSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email("Please enter a valid email address.")),
  token: v.pipe(v.string(), v.minLength(7, "Please enter the code received by email.")),
});

type FormValues = v.InferOutput<typeof FormSchema>;

export function VerifyEmailDialog({
  request,
  isOpen,
  onClose,
}: {
  request: UserEmailRequest;
  isOpen: boolean;
  onClose: (value: boolean) => void;
}) {
  return (
    <AppDialog size="xl" open={isOpen} onClose={onClose}>
      <DialogTitle>Verify Email</DialogTitle>
      <ContentView request={request} />
    </AppDialog>
  );
}

function ContentView({ request }: { request: UserEmailRequest }) {
  const form = useForm<FormValues>({
    resolver: valibotResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
    defaultValues: {
      email: request.emailVerificationRequest.email,
    },
  });

  const verify = verifyAddUserEmailRequest.bind(null, request.slug);
  const [response, action, pending] = useActionState(verify, null);

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
            We've sent you a verification code to confirm it's really you. Please check your inbox
            at <Strong>{request.emailVerificationRequest.email}</Strong>.
          </p>

          <div className="mt-6">
            <FormContentView response={response} pending={pending} />
          </div>

          <div className="mt-6">
            <HelpView />
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
      <TokenField />
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
        readOnly
        disabled
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
  );
}

function TokenField() {
  const name = "token";
  const { register } = useFormContext<FormValues>();
  const { errors } = useFormState<FormValues>({ name });
  const error = errors[name];

  return (
    <Field>
      <Label>Enter the code</Label>
      <Input
        {...register(name)}
        type="text"
        invalid={error != undefined}
        placeholder="ABC-XYZ"
        className="uppercase"
        autoFocus
        onInput={(e) => {
          let p = e.currentTarget.selectionStart;
          e.currentTarget.value = e.currentTarget.value.toUpperCase();
          e.currentTarget.setSelectionRange(p, p);
        }}
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Field>
  );
}

function CloseButton() {
  const close = useClose();
  return (
    <Button plain onClick={close}>
      Later
    </Button>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <ActionButton type="submit" inProgress={pending}>
      Verify
    </ActionButton>
  );
}

function HelpView() {
  return (
    <div className="space-y-0">
      <Text className="">
        Didn't receive the email? Wait a minute more and check your spam folder.
      </Text>
      <Text className="">
        Otherwise, we'll help you. Reach out to{" "}
        <TextLink href="mailto:hello@monkeys.app">hello@monkeys.app</TextLink>.
      </Text>
    </div>
  );
}
