import { AddExpenseButtonWithData } from "@/components/dashboard/AddExpenseButtonWithData";
import { getShareholders } from "@/data/shareholders";

export async function AddExpenseButton() {
  const shareholders = await getShareholders();
  return <AddExpenseButtonWithData shareholders={shareholders} />;
}
