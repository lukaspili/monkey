import { formatISO } from "date-fns";

export function formatIsoDateOnly(date: Date): string {
  return formatISO(date, { representation: "date" });
}
