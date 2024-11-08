import e from "#db/edgeql/index";
import AssertException from "#exceptions/assert_exception";
import { formatISO } from "date-fns";
import { AccessPolicyError, ConstraintViolationError, QueryAssertionError } from "edgedb";

export async function assertOneResult<T>(promise: Promise<T | null>): Promise<T> {
  const result = await promise;
  if (!result) {
    throw new AssertException();
  }

  return result;
}

export function isDatabaseConstraintViolation(error: unknown, message: string): boolean {
  if (!(error instanceof QueryAssertionError || error instanceof ConstraintViolationError)) {
    return false;
  }

  return error.message.includes(message);
}

export function isDatabasePolicyViolation(error: unknown): error is AccessPolicyError {
  return error instanceof AccessPolicyError;
}

export function localDateFrom(date: Date) {
  const str = formatISO(date, { representation: "date" });
  return e.cal.to_local_date(str);
}

export function castFromId(model: any, id: string) {
  return e.cast(model, e.cast(e.uuid, id));
}
