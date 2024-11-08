"use client";

import { verifySignUpRequest } from "@/actions/sign-up";
import { Button } from "@/catalyst/button";
import { ErrorMessage, Field, Label } from "@/catalyst/fieldset";
import { Input } from "@/catalyst/input";
import { Text, TextLink } from "@/catalyst/text";
import FormErrorView from "@/components/shared/FormErrorView";
import { SignUpRequest } from "@/models/sign-up-request";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { startTransition, useActionState, useRef } from "react";
import { FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
import * as v from "valibot";

const FormSchema = v.object({
  token: v.pipe(v.string(), v.trim(), v.minLength(6, "Please enter the code received by email.")),
});

type FormValues = v.InferOutput<typeof FormSchema>;

export function FormView({ request }: { request: SignUpRequest }) {
  const form = useForm<FormValues>({
    resolver: valibotResolver(FormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
  });

  const verify = verifySignUpRequest.bind(null, request.slug);
  const [response, action, pending] = useActionState(verify, null);

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
        {!pending && response && response.failed && (
          <div>
            <FormErrorView errors={response.errors} />
          </div>
        )}
        <div>
          <CodeView />
        </div>
        <div className="flex flex-col items-stretch">
          <SubmitButton pending={pending} />
        </div>
        <div>
          <HelpView />
        </div>
      </form>
    </FormProvider>
  );
}

function CodeView() {
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

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" color="dark/white" disabled={pending}>
      Confirm
    </Button>
  );
}

function HelpView() {
  return (
    <div className="space-y-2">
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
