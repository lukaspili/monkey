import { ComboboxInput } from "@headlessui/react";

export const InputView = ({
  onChange,
  onSubmit,
}: {
  onChange: (value: string) => void;
  onSubmit: () => void;
}) => {
  return (
    <ComboboxInput
      autoFocus
      className="w-full rounded-md border-0 bg-gray-100 px-4 py-3 text-gray-900 focus:ring-0 sm:text-sm lg:text-base placeholder:lg:text-base"
      placeholder="Describe the expense(s), for example: restaurant bob 50$, bob paid cinema 20$"
      onChange={(event) => onChange(event.target.value)}
      onBlur={() => onChange("")}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          console.log("ONKEYDOWN", "ENTER");
          onSubmit();
        }
      }}
    />
  );
};
