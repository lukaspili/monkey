import { FeedTableRow } from "@/components/dashboard/FeedTableRow";
import { getOperations } from "@/data/operations";
import { Subheading } from "catalyst/heading";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "catalyst/table";

export async function FeedTableView() {
  const operations = await getOperations();

  return (
    <div>
      <Subheading className="mt-14">Recent Expenses</Subheading>
      <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Title</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Summary</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {operations.map((operation) => (
            <FeedTableRow key={operation.id} operation={operation} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
