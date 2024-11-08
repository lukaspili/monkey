import { formatDate } from "@/lib/dates";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { GeneratedExpenseSchema } from "./schema";

// Allow streaming responses up to 30 seconds.
export const maxDuration = 30;

export async function POST(req: Request) {
  const { description }: { description: string } = await req.json();
  const currentUser = "Alice";

  const result = await streamObject({
    model: openai("gpt-4o"),

    system: `
      You are a program that split expenses among participants, from a natural language description.
      The resulting expense(s) should include a title, an optional description if pertinent, an amount, a date, a list of participants who paid (payers) and a list of participants who didn't pay (payees).
      The title should be exctracted from the description. If it's more than few words, summarize it.
      The title should not contain the date.
      The title should not contain the names of the participants.
      For each participant, include their name, the percentage of their share of the expense and the amount they paid (zero if they didn't pay).
      The percentage of a participant's share can be different from the amount they paid. If their share amount is higher than the amount they paid, they owe money to the other participants. If their share amount is lower than the amount they paid, they are owed money by the other participants.
      Unless otherwise specified, the current user is always a participant.
      When no split is specified, split the expense evenly among all participants.
      When no details about who paid for what are specified, assume the current user paid for the whole expense.
      Ensure accurate calculations based on given splits.
      Ensure the sum of all participants' shares equals 100%.
      Ensure the sum of all participants' paid amounts equals the expense's amount.
      Handle edge cases where the split might not be equal and involves custom proportions.
      Most commonly, create one expense, but feel free to create multiple ones if the description warrants it.
      The current user name is: "${currentUser}".
      When no date is supplied, use the today's date: ${formatDate(new Date())}.
    `,

    prompt: `Please create and split the expenses from the following description: "${description}"`,
    schema: GeneratedExpenseSchema,
    output: "array",
    onFinish({ usage }) {
      console.log("Usage: ", usage);
    },
  });

  return result.toTextStreamResponse();
}
