import { GuardOperationSharesAreValid } from "#guards/operation_shares_are_valid";
import { Validators } from "#validators/session/operations_validator";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";

type Share = Infer<typeof Validators.Session.Operations.Schema.Share>;

export type CalculatedShare = Share & {
  shareAmount: number;
  owedAmount: number;
};

export type LedgerEntryPayload = {
  holderId: string;
  counterpartyId: string;
  amount: number;
};

@inject()
export class CalculateOperationSharesTask {
  constructor(private guardOperationSharesAreValid: GuardOperationSharesAreValid) {}

  calculate(payload: Infer<typeof Validators.Session.Operations.Schema.Operation>): {
    shares: CalculatedShare[];
    entries: LedgerEntryPayload[];
  } {
    // Validate the input data
    this.guardOperationSharesAreValid.orFail(payload);

    const { amount, shares } = payload;

    // Step 1: Calculate owed amounts for each share
    const sharesWithOwedAmounts = this.calculateOwedAmounts(amount, shares);

    // Step 2: Generate ledger entries to settle debts
    const entries = this.generateLedgerEntries(sharesWithOwedAmounts);

    return { shares: sharesWithOwedAmounts, entries };
  }

  // Calculate the owed amount for each share
  private calculateOwedAmounts(totalAmount: number, shares: Share[]): CalculatedShare[] {
    const result: CalculatedShare[] = [];
    let totalCalculatedAmount = 0;

    // Calculate share amounts and owed amounts (owedAmount cannot be negative)
    for (const share of shares) {
      const shareAmount = (totalAmount * share.share) / 100;
      totalCalculatedAmount += shareAmount;
      const owedAmount = Math.max(0, shareAmount - share.paidAmount);
      result.push({
        ...share,
        shareAmount,
        owedAmount,
      });
    }

    // Adjust for any rounding errors by modifying the first share
    const roundingError = totalAmount - totalCalculatedAmount;
    if (roundingError !== 0) {
      const firstShare = result[0];
      firstShare.shareAmount += roundingError;
      firstShare.owedAmount = Math.max(0, firstShare.shareAmount - firstShare.paidAmount);
    }

    return result;
  }

  // Generate ledger entries where the counterparty owes the holder
  private generateLedgerEntries(shares: CalculatedShare[]): LedgerEntryPayload[] {
    // Map to track net balances for each shareholder
    const balances = new Map(shares.map((s) => [s.shareholderId, s.shareAmount - s.paidAmount]));

    // Identify debtors (owe money) and creditors (are owed money)
    const debtors = shares
      .filter((s) => balances.get(s.shareholderId)! > 0)
      .sort((a, b) => balances.get(a.shareholderId)! - balances.get(b.shareholderId)!);

    const creditors = shares
      .filter((s) => balances.get(s.shareholderId)! < 0)
      .sort((a, b) => balances.get(a.shareholderId)! - balances.get(b.shareholderId)!);

    const entries: LedgerEntryPayload[] = [];

    // Match debtors with creditors to settle debts
    for (const debtor of debtors) {
      let debtorBalance = balances.get(debtor.shareholderId)!;

      for (const creditor of creditors) {
        let creditorBalance = balances.get(creditor.shareholderId)!;

        if (debtorBalance <= 0) break; // Debtor has settled all debts
        if (creditorBalance >= 0) continue; // Creditor has been fully repaid

        // Determine the transfer amount
        const amount = Math.min(debtorBalance, -creditorBalance);

        // Create entry only if amount is positive
        if (amount > 0) {
          entries.push({
            holderId: creditor.shareholderId, // Creditor is owed money
            counterpartyId: debtor.shareholderId, // Debtor owes money
            amount: amount,
          });

          entries.push({
            holderId: debtor.shareholderId,
            counterpartyId: creditor.shareholderId,
            amount: -amount,
          });

          // Update balances after transaction
          debtorBalance -= amount;
          creditorBalance += amount;
          balances.set(debtor.shareholderId, debtorBalance);
          balances.set(creditor.shareholderId, creditorBalance);
        }
      }
    }

    return entries;
  }
}
