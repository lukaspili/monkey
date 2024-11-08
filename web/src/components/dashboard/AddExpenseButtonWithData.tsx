"use client";

import { AddExpenseDialog } from "@/components/add-expense/add-expense-dialog";
import { OwnerShareholder } from "@/models/shareholder";
import { PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "catalyst/button";
import { useState } from "react";

export function AddExpenseButtonWithData({ shareholders }: { shareholders: OwnerShareholder[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon />
        Add Expense
      </Button>
      <AddExpenseDialog open={isOpen} setOpen={setIsOpen} shareholders={shareholders} />
    </>
  );
}
