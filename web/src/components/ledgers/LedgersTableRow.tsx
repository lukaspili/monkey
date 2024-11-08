"use client";

import { formatAmount } from "@/lib/money";
import { OwnerLedger } from "@/models/ledger";
import { TableCell, TableRow } from "catalyst/table";

export function LedgersTableRow({ ledger }: { ledger: OwnerLedger }) {
  return (
    <TableRow key={ledger.id} title={ledger.counterparty.name}>
      <TableCell>{ledger.counterparty.name}</TableCell>
      <TableCell className="text-right">{formatAmount(ledger.balance)}</TableCell>
    </TableRow>
  );
}
