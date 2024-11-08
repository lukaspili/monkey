import { FirstStepValidityAtom } from "@/components/new-expense-dialog/NewExpenseContentView";
import { FormUserSchema, FormValues } from "@/components/new-expense-dialog/schema";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { OwnerShareholder } from "@/models/shareholder";
import { CheckIcon } from "@heroicons/react/16/solid";
import { Avatar } from "catalyst/avatar";
import { Field, Label } from "catalyst/fieldset";
import { useCommandState } from "cmdk";
import { useSetAtom } from "jotai";
import { useFormContext } from "react-hook-form";
import * as v from "valibot";

type Option = {
  item: v.InferOutput<typeof FormUserSchema>;
  selected: boolean;
};

export function PayeesField({
  availableShareholders,
}: {
  availableShareholders: OwnerShareholder[];
}) {
  const { watch, setValue } = useFormContext<FormValues>();
  const selectedPayers = watch("payers", []);

  const setFirstStepValidity = useSetAtom(FirstStepValidityAtom);

  const selectedIds = new Set(selectedPayers.map((p) => p.id));

  const options: Option[] = availableShareholders.map((shareholder) => {
    return {
      item: {
        id: shareholder.id,
        name: shareholder.isAccountOwner ? `${shareholder.name} (You)` : shareholder.name,
        initials: shareholder.initials,
        avatar: shareholder.avatar?.url,
        isAccountOwner: shareholder.isAccountOwner,
      },
      selected: selectedIds.has(shareholder.id),
    };
  });

  const selectPayer = (option: Option) => {
    setValue("payers", [option.item]);

    setFirstStepValidity((state) => ({
      ...state,
      payers: true,
    }));
  };

  return (
    <Field>
      <Label className="mb-4 px-[--gutter]">Who didn't pay his share?</Label>
      <div data-slot="control">
        <Command
          className="overflow-hidden rounded-t-none border-t bg-transparent"
          label="Who paid?"
        >
          <CommandInput
            placeholder="Enter the name of the person who paid..."
            className="border-none focus:ring-0"
          />
          <CommandList>
            <EmptyView />
            <CommandGroup className="p-2">
              {options.map((option) => (
                <CommandItem
                  key={option.item.id}
                  className="flex items-center px-2"
                  onSelect={() => {
                    selectPayer(option);
                  }}
                >
                  <Avatar
                    initials={option.item.initials}
                    className="size-8 border-none bg-zinc-50 text-xs outline-zinc-100"
                  />
                  <div className="ml-2">
                    <p className="text-sm font-medium leading-none">{option.item.name}</p>
                    {/* <p className="text-muted-foreground text-sm">{user.email}</p> */}
                  </div>
                  {option.selected ? (
                    <CheckIcon className="text-primary ml-auto flex h-5 w-5" />
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </Field>
  );
}

const EmptyView = () => {
  const search = useCommandState((state) => state.search);
  return <CommandEmpty>No results found for "{search}".</CommandEmpty>;
};
