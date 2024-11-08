import { GeneratedExpenseSchema } from "@/app/api/expense/schema";
import { AddExpenseDialogCanBeDismissedAtom } from "@/components/add-expense/add-expense-dialog";
import { InputView } from "@/components/add-expense/add-expense-input";
import { PreviewView } from "@/components/add-expense/add-expense-preview";
import { CalculatedExpense, calculateExpense } from "@/lib/expenses";
import { Combobox, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { experimental_useObject } from "ai/react";
import clsx from "clsx";
import { atom, useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { z } from "zod";

export const ExpensesAtom = atom<CalculatedExpense[]>([]);

const people = [
  { id: 1, name: "Leslie Alexander", url: "#" },
  // More people...
];

export const ContentView = () => {
  const [query, setQuery] = useState("");
  const [expenses, setExpenses] = useAtom(ExpensesAtom);

  const setDialogCanBeDismissed = useSetAtom(AddExpenseDialogCanBeDismissedAtom);

  const hasGeneratedExpenses = expenses.length > 0;

  const { submit, isLoading, object } = experimental_useObject({
    api: "/api/expense",
    schema: z.array(GeneratedExpenseSchema),
    onFinish({ object: generatedExpenses }) {
      const hasValidResult = generatedExpenses != null && generatedExpenses.length > 0;
      if (!hasValidResult) {
        setDialogCanBeDismissed(true);
        setExpenses([]);
        return;
      }

      const calculatedExpenses = generatedExpenses.map((expense) => calculateExpense(expense));

      setDialogCanBeDismissed(false);
      setExpenses(calculatedExpenses);
    },
    onError: () => {
      console.error("You've been rate limited, please try again later!");
    },
  });

  const onSubmit = () => {
    console.log("SUBMIT", query);
    // submit({ description: "w Bob, restaurant 100$, bob paid cinema 50$ but he invited me" });
    // submit({ description: "restaurant w bob and john 100$" });
    submit({ description: "restaurant bob 50$, bob paid cinema 20$" });
  };

  const filteredPeople =
    query === ""
      ? []
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      onChange={(person) => {
        // console.log("ONCHANGE", person);
      }}
    >
      <div className="relative p-2">
        {!hasGeneratedExpenses && <InputView onChange={setQuery} onSubmit={onSubmit} />}

        <ComboboxOptions
          static
          modal
          // className="-mb-2 max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
        >
          <ComboboxOption
            value={{ id: 0 }}
            className="hidden cursor-default select-none rounded-md px-4 py-2 data-[focus]:bg-indigo-600 data-[focus]:text-white"
          >
            Create
          </ComboboxOption>
        </ComboboxOptions>

        {filteredPeople.length > 0 && (
          <ComboboxOptions
            static
            modal
            className="-mb-2 max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
          >
            {filteredPeople.map((person) => (
              <ComboboxOption
                key={person.id}
                value={person}
                className="cursor-default select-none rounded-md px-4 py-2 data-[focus]:bg-indigo-600 data-[focus]:text-white"
              >
                {person.name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>

      {isLoading && <div>Loading...</div>}
      {expenses.length > 0 && <PreviewView expenses={expenses} />}
    </Combobox>
  );
};

const EmptyView = () => {};

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
