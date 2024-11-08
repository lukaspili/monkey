"use client";

import {
  AppDialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/extralyst/dialog";
import { Text } from "@/extralyst/text";
import { Button } from "catalyst/button";
import { Field, Label } from "catalyst/fieldset";
import { Input } from "catalyst/input";
import { Strong, TextLink } from "catalyst/text";
import { useState } from "react";

export default function CodeDialog() {
  let [isOpen, setIsOpen] = useState(true);

  return (
    <AppDialog size="3xl" open={isOpen} onClose={() => {}}>
      <DialogTitle>Confirm your email address</DialogTitle>
      <DialogDescription>
        <Text size="lg" className="text-zinc-700">
          We've sent a confirmation link. Please check your inbox at <Strong>foo@bar.com</Strong>.
          <br />
          You can also enter the code manually below.
        </Text>
      </DialogDescription>
      <DialogBody>
        <Field>
          <Label>Code</Label>
          <Input name="amount" className="max-w-96" />
        </Field>

        <Text className="mt-6">
          Didn't receive the email? Please wait a minute more and check your spam folder.
          <br /> If you think the issue is on our side, please write to{" "}
          <TextLink href="mailto:hello@monkeys.app">hello@monkeys.app</TextLink>.
        </Text>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => setIsOpen(false)}>
          Resend link
        </Button>
        <Button onClick={() => setIsOpen(false)}>Confirm with code</Button>
      </DialogActions>
    </AppDialog>
  );
}
