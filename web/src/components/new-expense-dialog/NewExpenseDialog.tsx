import { NewExpenseContentView } from "@/components/new-expense-dialog/NewExpenseContentView";
import { AppDialog } from "@/extralyst/dialog";
import { OwnerShareholder } from "@/models/shareholder";

export function NewExpenseDialog({
  isOpen,
  onClose,
  availableShareholders,
}: {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  availableShareholders: OwnerShareholder[];
}) {
  return (
    <AppDialog size="xl" open={isOpen} onClose={onClose}>
      <NewExpenseContentView availableShareholders={availableShareholders} />
    </AppDialog>
  );
}
