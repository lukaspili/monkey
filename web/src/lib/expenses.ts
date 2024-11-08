import { GeneratedExpense, GeneratedParticipant } from "@/app/api/expense/schema";

export type CalculatedParticipant = GeneratedParticipant & {
  shareAmount: number;
  owedAmount: number;
};

export type LedgerEntry = {
  holder: string;
  counterparty: string;
  amount: number;
};

export type CalculatedExpense = GeneratedExpense & {
  participants: CalculatedParticipant[];
  entries: LedgerEntry[];
};

export const calculateExpense = (expense: GeneratedExpense): CalculatedExpense => {
  // Validate the input data
  // this.guardOperationSharesAreValid.orFail(payload);

  const { amount, participants } = expense;

  // Step 1: Calculate owed amounts for each share
  const calculatedParticipants = calculateOwedAmounts(amount, participants);

  // Step 2: Generate ledger entries to settle debts
  const entries = generateLedgerEntries(calculatedParticipants);

  return { ...expense, participants: calculatedParticipants, entries };
};

// Calculate the owed amount for each share
const calculateOwedAmounts = (
  totalAmount: number,
  participants: GeneratedParticipant[]
): CalculatedParticipant[] => {
  const result: CalculatedParticipant[] = [];
  let totalCalculatedAmount = 0;

  // Calculate share amounts and owed amounts (owedAmount cannot be negative)
  for (const share of participants) {
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
};

// Generate ledger entries where the counterparty owes the holder
const generateLedgerEntries = (participants: CalculatedParticipant[]): LedgerEntry[] => {
  // Map to track net balances for each shareholder
  const balances = new Map(participants.map((p) => [p.name, p.shareAmount - p.paidAmount]));

  // Identify debtors (owe money) and creditors (are owed money)
  const debtors = participants
    .filter((s) => balances.get(s.name)! > 0)
    .sort((a, b) => balances.get(a.name)! - balances.get(b.name)!);

  const creditors = participants
    .filter((s) => balances.get(s.name)! < 0)
    .sort((a, b) => balances.get(a.name)! - balances.get(b.name)!);

  const entries: LedgerEntry[] = [];

  // Match debtors with creditors to settle debts
  for (const debtor of debtors) {
    let debtorBalance = balances.get(debtor.name)!;

    for (const creditor of creditors) {
      let creditorBalance = balances.get(creditor.name)!;

      if (debtorBalance <= 0) break; // Debtor has settled all debts
      if (creditorBalance >= 0) continue; // Creditor has been fully repaid

      // Determine the transfer amount
      const amount = Math.min(debtorBalance, -creditorBalance);

      // Create entry only if amount is positive
      if (amount > 0) {
        entries.push({
          holder: creditor.name, // Creditor is owed money
          counterparty: debtor.name, // Debtor owes money
          amount,
        });

        entries.push({
          holder: debtor.name,
          counterparty: creditor.name,
          amount: -amount,
        });

        // Update balances after transaction
        debtorBalance -= amount;
        creditorBalance += amount;
        balances.set(debtor.name, debtorBalance);
        balances.set(creditor.name, creditorBalance);
      }
    }
  }

  return entries;
};
