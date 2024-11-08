"use client";

import { requestToVerifyAtom } from "@/components/account/emails/EmailTableRowDialogsView";
import { UserEmailRequest } from "@/models/user";
import { Button } from "catalyst/button";
import { useSetAtom } from "jotai";

export function VerifyEmailButton({ request }: { request: UserEmailRequest }) {
  const setRequestToVerify = useSetAtom(requestToVerifyAtom);

  return (
    <Button outline onClick={() => setRequestToVerify(request)}>
      Verify
    </Button>
  );
}
