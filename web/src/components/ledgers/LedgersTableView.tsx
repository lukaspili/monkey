import { LedgersTableRow } from "@/components/ledgers/LedgersTableRow";
import { getLedgers } from "@/data/ledgers";
import { Subheading } from "catalyst/heading";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "catalyst/table";

export async function LedgersTableView() {
  const ledgers = await getLedgers();

  return (
    <div>
      <Subheading className="mt-14">Recent Expenses</Subheading>
      <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Person</TableHeader>
            <TableHeader>Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {ledgers.map((ledger) => (
            <LedgersTableRow key={ledger.id} ledger={ledger} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
