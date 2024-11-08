import { DeepPartial } from "ai";
import { z } from "zod";

export const GeneratedParticipantSchema = z.object({
  name: z.string().describe("Name of the participant."),
  share: z.number().describe("Percentage of participant's share of the expense in 0-100 format."),
  paidAmount: z
    .number()
    .describe(
      "Amount that the participant paid in 00.00 format. If the participant didn't pay, the value should be 0."
    ),
});

export const GeneratedExpenseSchema = z.object({
  title: z.string().describe("Title of the expense."),
  description: z.string().optional().describe("Optional description of the expense."),
  amount: z.number().describe("Amount of the expense in 00.00 format."),
  date: z.string().describe("Date of the expense, in yyyy-MM-dd format."),
  participants: z.array(GeneratedParticipantSchema).describe("All participants in the expense."),
});

// export const GeneratedExpensesSchema = z.object({
//   expenses: z.array(GeneratedExpenseSchema),
// });

export type PartialGeneratedExpense = DeepPartial<typeof GeneratedExpenseSchema>[];

export type GeneratedExpense = z.infer<typeof GeneratedExpenseSchema>;

export type GeneratedParticipant = z.infer<typeof GeneratedParticipantSchema>;
