import { ContentView } from "@/components/add-expense/add-expense-content";
import { OwnerShareholder } from "@/models/shareholder";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { atom, useStore } from "jotai";

export const AddExpenseDialogCanBeDismissedAtom = atom<boolean>(true);
AddExpenseDialogCanBeDismissedAtom.onMount = (set) => {
  return () => {
    set(true);
  };
};

export const AddExpenseDialog = ({
  open,
  setOpen,
  shareholders,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  shareholders: OwnerShareholder[];
}) => {
  const store = useStore();

  return (
    <Dialog
      className="relative z-10"
      open={open}
      onClose={() => {
        const canBeDismissed = store.get(AddExpenseDialogCanBeDismissedAtom);
        if (canBeDismissed) {
          setOpen(false);
        }
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-70 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-150 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <DialogPanel
          transition
          className="mx-auto max-w-3xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-150 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <ContentView />
        </DialogPanel>
      </div>
    </Dialog>
  );
};
