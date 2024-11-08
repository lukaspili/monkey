import e from "#db/edgeql/index";
import { OwnerOperation, OwnerOperationShape } from "#models/operation";
import { CalculateOperationSharesTask } from "#tasks/calculate_operation_shares";
import { formatIsoDateOnly } from "#utils/date";
import { Validators } from "#validators/session/operations_validator";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import { Client } from "edgedb";

@inject()
export class CreateOperationTask {
  constructor(private readonly calculateOperationShares: CalculateOperationSharesTask) {}

  async create(
    client: Client,
    userId: string,
    payload: Infer<typeof Validators.Session.Operations.create>
  ): Promise<OwnerOperation> {
    const { title, descritpion, date, amount } = payload;
    const { shares, entries } = this.calculateOperationShares.calculate(payload);

    // Get distinct ledgers impacted by the operation, to update their balances.
    const uniqueLedgers = [
      ...new Set(entries.map((entry) => `${entry.holderId}_${entry.counterpartyId}`)),
    ];
    const ledgers = uniqueLedgers.map((ledger) => {
      const [holderId, counterpartyId] = ledger.split("_");
      return {
        holderId,
        counterpartyId,
      };
    });

    // Get distinct shareholders impacted by the operation, to update their financial overview.
    // Payload shares are already validated to be distinct by shareholderId.
    const shareholders = shares.map((share) => share.shareholderId);

    // Trying to make `insertOperation` and `insertOperationShares` into a single query fails with error:
    // `Expr or its aliases used outside of declared 'WITH' block scope`.
    // Unclear why? Try to revisit this later. Until then, use 2 queries in transaction.
    const operationId = await client.transaction(async (tx) => {
      // Create the operation
      const { id: operationId } = await Query.insertOperation.run(tx, {
        title,
        description: descritpion || null,
        amount,
        date: formatIsoDateOnly(date),
        ownerId: userId,
      });

      // Create the operation shares and ledgers' entries. Ledgers are created if it's the first entry between two parties.
      await Query.insertSharesAndEntries.run(tx, {
        ownerId: userId,
        operationId,
        shares,
        entries,
      });

      // Update the ledgers' balances and entries count.
      await Query.updateLedgers.run(tx, { ledgers });

      // Update the shareholders' financial overview.
      await Query.updateFinancialOverviews.run(tx, { shareholders });

      return operationId;
    });

    // Refetch the operation to also include the newly created shares and entries.
    const operation = await Query.findOperation.run(client, { id: operationId });
    return operation;
  }
}

const Query = {
  insertOperation: e.params(
    {
      title: e.str,
      description: e.optional(e.str),
      amount: e.int64,
      date: e.str,
      ownerId: e.uuid,
    },
    ($) => {
      const inserted = e.insert(e.Operation, {
        title: $.title,
        description: $.description,
        amount: $.amount,
        eventDate: e.cal.to_local_date($.date),
        owner: e.cast(e.User, $.ownerId),
      });

      return inserted;
    }
  ),

  insertSharesAndEntries: e.params(
    {
      ownerId: e.uuid,
      operationId: e.uuid,
      shares: e.array(
        e.tuple({
          shareholderId: e.uuid,
          share: e.int16,
          shareAmount: e.int64,
          paidAmount: e.int64,
          owedAmount: e.int64,
        })
      ),
      entries: e.array(
        e.tuple({
          holderId: e.uuid,
          counterpartyId: e.uuid,
          amount: e.int64,
        })
      ),
    },
    ($) => {
      const insertedShares = e.for(e.array_unpack($.shares), (share) => {
        const insertedShare = e.insert(e.OperationShare, {
          share: share.share,
          shareAmount: share.shareAmount,
          paidAmount: share.paidAmount,
          owedAmount: share.owedAmount,
          shareholder: e.cast(e.Shareholder, share.shareholderId),
          operation: e.cast(e.Operation, $.operationId),
        });

        return insertedShare;
      });

      const insertedEntries = e.for(e.array_unpack($.entries), (entry) => {
        const insertedLedger = e
          .insert(e.Ledger, {
            holder: e.cast(e.Shareholder, entry.holderId),
            counterparty: e.cast(e.Shareholder, entry.counterpartyId),
          })
          .unlessConflict((ledger) => {
            return {
              on: e.tuple([ledger.holder, ledger.counterparty]),
              else: ledger,
            };
          });

        const insertedEntry = e.insert(e.LedgerEntry, {
          ledger: insertedLedger,
          operation: e.cast(e.Operation, $.operationId),
          amount: entry.amount,
        });

        return insertedEntry;
      });

      return e.with([insertedEntries, insertedShares], e.select(true));
    }
  ),

  updateLedgers: e.params(
    {
      ledgers: e.array(
        e.tuple({
          holderId: e.uuid,
          counterpartyId: e.uuid,
        })
      ),
    },
    ($) => {
      const updatedLedgers = e.for(e.array_unpack($.ledgers), (ledger) => {
        const selectedLedger = e.select(e.Ledger, (_) => ({
          filter_single: {
            holder: e.cast(e.Shareholder, ledger.holderId),
            counterparty: e.cast(e.Shareholder, ledger.counterpartyId),
          },
        }));

        const selectedEntries = e.select(e.LedgerEntry, (entry) => ({
          amount: true,
          filter: e.op(entry.ledger, "=", selectedLedger),
        }));

        const balance = e.select(e.sum(selectedEntries.amount));
        const entriesCount = e.count(selectedEntries);

        const updatedLedger = e.update(selectedLedger, (_) => ({
          set: {
            balance,
            entriesCount,
          },
        }));

        return updatedLedger;
      });

      return updatedLedgers;
    }
  ),

  updateFinancialOverviews: e.params(
    {
      shareholders: e.array(e.uuid),
    },
    ($) => {
      const updatedFinancialOverviews = e.for(e.array_unpack($.shareholders), (shareholderId) => {
        const selectedLedgersWithCredit = e.select(e.Ledger, (ledger) => {
          const equalsHolder = e.op(ledger.holder.id, "=", shareholderId);
          const hasPositiveBalance = e.op(ledger.balance, ">", 0);
          return {
            balance: true,
            filter: e.op(equalsHolder, "and", hasPositiveBalance),
          };
        });

        const totalOwedAmount = e.select(e.sum(selectedLedgersWithCredit.balance));
        const totalOwedShareholdersCount = e.count(selectedLedgersWithCredit);

        const largestCreditLedger = e
          .select(selectedLedgersWithCredit, (ledger) => ({
            balance: true,
            order_by: [{ expression: ledger.balance, direction: e.DESC }],
            limit: 1,
          }))
          .assert_single();

        const selectedLedgersWithDebt = e.select(e.Ledger, (ledger) => {
          const equalsCounterparty = e.op(ledger.counterparty.id, "=", shareholderId);
          const hasPositiveBalance = e.op(ledger.balance, ">", 0);
          return {
            balance: true,
            filter: e.op(equalsCounterparty, "and", hasPositiveBalance),
          };
        });

        const totalDueAmount = e.select(e.sum(selectedLedgersWithDebt.balance));
        const totalDueShareholdersCount = e.count(selectedLedgersWithDebt);

        const largestDebtLedger = e
          .select(selectedLedgersWithDebt, (ledger) => ({
            balance: true,
            order_by: [{ expression: ledger.balance, direction: e.DESC }],
            limit: 1,
          }))
          .assert_single();

        const updatedFinancialOverview = e.update(e.FinancialOverview, (_) => ({
          filter_single: {
            shareholder: e.cast(e.Shareholder, shareholderId),
          },
          set: {
            totalOwedAmount: e.op(totalOwedAmount, "??", 0),
            totalOwedShareholdersCount: totalOwedShareholdersCount,
            largestCreditAmount: e.op(largestCreditLedger.balance, "??", 0),
            largestCreditShareholder: largestCreditLedger.counterparty,
            totalDueAmount: e.op(totalDueAmount, "??", 0),
            totalDueShareholdersCount: totalDueShareholdersCount,
            largestDebtAmount: e.op(largestDebtLedger.balance, "??", 0),
            largestDebtShareholder: largestDebtLedger.holder,
          },
        }));

        return updatedFinancialOverview;
      });

      return updatedFinancialOverviews;
    }
  ),

  findOperation: e.params({ id: e.uuid }, ($) => {
    return e.assert_exists(
      e.select(e.Operation, (_) => ({
        ...OwnerOperationShape(_),
        filter_single: { id: $.id },
      }))
    );
  }),
};
