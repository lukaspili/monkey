import { CalculatedExpense } from "@/lib/expenses";
import { formatAmount } from "@/lib/money";
import * as Headless from "@headlessui/react";
import { UsersIcon } from "@heroicons/react/16/solid";
import { Button } from "catalyst/button";
import { Label } from "catalyst/fieldset";
import { Switch } from "catalyst/switch";
import clsx from "clsx";
import { Fragment } from "react";

export const PreviewView = ({ expenses }: { expenses: CalculatedExpense[] }) => {
  return (
    <div>
      <div className="px-3">
        <p className="text-center text-zinc-600">The following expense will be added</p>
        <div className="flex flex-col gap-2 px-2 py-4">
          {expenses.map((expense, index) => (
            <ItemView key={index} expense={expense} />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <PreviewFooterView />
      </div>
    </div>
  );
};

const ItemView = ({ expense }: { expense: CalculatedExpense }) => {
  const { participants, entries } = expense;
  const payers = participants.filter((participant) => participant.paidAmount > 0);
  const debtors = entries.filter((entry) => entry.amount > 0);

  return (
    <div>
      <div className="rounded-lg border border-zinc-300 p-2">
        <div className="flex justify-between">
          <div>
            <div className="text-lg font-medium">{expense.title}</div>
            <p className="text-sm text-zinc-500">{expense.date}</p>
          </div>
          <div className="font-medium">{formatAmount(expense.amount * 100)}</div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {payers.map((participant, index) => (
            <Fragment key={index}>
              {index > 0 && <span className="text-zinc-400">|</span>}
              <div className="text-sm text-zinc-500">
                {participant.name} paid {formatAmount(participant.paidAmount * 100)}
              </div>
            </Fragment>
          ))}
          {debtors.map((entry, index) => (
            <Fragment key={index}>
              <span className="text-zinc-400">|</span>
              <div className="text-sm text-zinc-500">
                {entry.counterparty} owes {formatAmount(entry.amount * 100)} to {entry.holder}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <div className="mt-0.5 flex justify-end gap-2">
        <Button plain>Delete</Button>
        <Button plain>Edit</Button>
      </div>
    </div>
  );
};

const PreviewFooterView = () => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-4 bg-gray-50 px-4 py-2.5 text-xs text-gray-700">
      <Headless.Field className="flex items-center gap-2">
        <Switch name="allow_embedding" />
        <Label>Create more</Label>
      </Headless.Field>
      <Button onClick={() => {}} className="cursor-pointer">
        Confirm
      </Button>
    </div>
  );
};

const EmptyView = () => {
  return (
    <div className="px-4 py-14 text-center sm:px-14">
      <UsersIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
      <p className="mt-4 text-sm text-gray-900">No people found using that search term.</p>
    </div>
  );
};

const HelpView = () => {
  return (
    <div className="flex flex-wrap items-center bg-gray-50 px-4 py-2.5 text-xs text-gray-700">
      Type{" "}
      <kbd
        className={clsx(
          "mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2",
          "border-gray-400 text-gray-900"
        )}
      >
        #
      </kbd>{" "}
      <span className="sm:hidden">for projects,</span>
      <span className="hidden sm:inline">to access projects,</span>
      <kbd
        className={clsx(
          "mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2",
          "border-gray-400 text-gray-900"
        )}
      >
        &gt;
      </kbd>{" "}
      for users, and{" "}
      <kbd
        className={clsx(
          "mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2",
          "border-gray-400 text-gray-900"
        )}
      >
        ?
      </kbd>{" "}
      for help.
    </div>
  );
};
