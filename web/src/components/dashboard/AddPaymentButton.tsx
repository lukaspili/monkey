import { AddPaymentButtonWithData } from "@/components/dashboard/AddPaymentButtonWithData";
import { getShareholders } from "@/data/shareholders";

export async function AddPaymentButton() {
  const availableShareholders = await getShareholders();
  return <AddPaymentButtonWithData availableShareholders={availableShareholders} />;
}
