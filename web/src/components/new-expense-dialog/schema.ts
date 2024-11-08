import { isPast, parseISO } from "date-fns";
import * as v from "valibot";

export const FormUserSchema = v.object({
  id: v.optional(v.string()),
  name: v.string(),
  initials: v.string(),
  avatar: v.optional(v.string()),
  isAccountOwner: v.boolean(),
});

export const FormSchemaStep1 = {
  title: v.pipe(v.string(), v.trim(), v.minLength(2, "Please enter a title for the expense.")),
  amount: v.pipe(
    v.string(),
    v.decimal(),
    v.check((input) => parseFloat(input) > 0, "Please enter a valid amount.")
  ),
  date: v.pipe(
    v.string(),
    v.isoDate(),
    v.check((input) => isPast(parseISO(input)), "Please enter a valid date.")
  ),
  payers: v.pipe(v.array(FormUserSchema), v.minLength(1, "Select the person who paid.")),
};

export const FormSchemaStep2 = {
  payees: v.pipe(
    v.array(FormUserSchema),
    v.minLength(1, "Select at least one person that didn't pay.")
  ),
};

export const FormSchema = v.object({
  ...FormSchemaStep1,
  ...FormSchemaStep2,
});

export type FormValues = v.InferOutput<typeof FormSchema>;
