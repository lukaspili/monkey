"use client";

import { formatAmount } from "@/lib/money";
import { OwnerOperation } from "@/models/operation";
import { ChevronDownIcon, ChevronUpIcon, EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import { Avatar } from "catalyst/avatar";
import { TableCell, TableRow } from "catalyst/table";
import { useEffect, useRef, useState } from "react";

export function FeedTableRow({ operation }: { operation: OwnerOperation }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  return (
    <>
      <TableRow
        onClick={() => setIsExpanded(!isExpanded)}
        className="group cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800"
      >
        <TableCell className="text-zinc-500">{operation.eventDate}</TableCell>
        <TableCell className="flex flex-row items-center gap-2">
          {operation.title} <EllipsisHorizontalIcon className="size-3 text-zinc-400" />
        </TableCell>
        <TableCell>{formatAmount(operation.amount)}</TableCell>
        <TableCell>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center justify-center -space-x-2">
              <Avatar
                initials="AL"
                className="size-6 bg-white ring-2 ring-white dark:ring-zinc-900"
              />
              <Avatar
                initials="LU"
                className="size-6 bg-white ring-2 ring-white dark:ring-zinc-900"
              />
            </div>
            <p>Lukasz owes $100 to Alice</p>
          </div>
        </TableCell>
        <TableCell>
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </TableCell>
      </TableRow>
      <tr className="border-none">
        <td colSpan={5} className="border-none">
          <div
            style={{ height: `${height}px` }}
            className="overflow-hidden transition-[height] duration-150 ease-in-out"
          >
            <div ref={contentRef}>
              <div className="border-b border-zinc-950/5 bg-white px-4 py-4 dark:border-white/5 dark:border-zinc-700 dark:bg-zinc-800">
                <h4 className="mb-2 font-semibold">Participants:</h4>
                <div className="grid grid-cols-2 gap-4">
                  {operation.entries.map((ledgerEntry) => (
                    <div key={ledgerEntry.id} className="flex items-center gap-2">
                      <Avatar
                        initials={ledgerEntry.ledger.counterparty.name.substring(0, 2)}
                        src={ledgerEntry.ledger.counterparty.avatar?.url}
                        className="size-6"
                      />
                      <span>
                        {ledgerEntry.ledger.counterparty.name}: Paid {ledgerEntry.amount}, Owes{" "}
                        {ledgerEntry.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
