import { LedgersTableView } from "@/components/ledgers/LedgersTableView";
import { Heading } from "catalyst/heading";

export default async function LedgersView() {
  return (
    <div>
      <Heading>Who Owns Who</Heading>
      <LedgersTableView />
    </div>
  );
}
