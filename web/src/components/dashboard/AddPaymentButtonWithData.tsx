"use client";

import { NewExpenseDialog } from "@/components/new-expense-dialog/NewExpenseDialog";
import { OwnerShareholder } from "@/models/shareholder";
import { BanknotesIcon } from "@heroicons/react/16/solid";
import { Button } from "catalyst/button";
import { useState } from "react";

export function AddPaymentButtonWithData({
  availableShareholders,
}: {
  availableShareholders: OwnerShareholder[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button outline onClick={() => setIsOpen(true)}>
        <BanknotesIcon />
        Make Payment
      </Button>
      <NewExpenseDialog
        isOpen={isOpen}
        onClose={setIsOpen}
        availableShareholders={availableShareholders}
      />
    </>
  );
}
