"use client";

import { AddEmailDialog } from "@/components/account/emails/AddEmailDialog";
import { PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "catalyst/button";
import { useState } from "react";

export function AddEmailButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button outline onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Add another
      </Button>
      <AddEmailDialog isOpen={isOpen} onClose={setIsOpen} />
    </>
  );
}
