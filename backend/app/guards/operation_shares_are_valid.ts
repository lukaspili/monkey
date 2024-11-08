import ValidationException from "#exceptions/validation_exception";
import { Validators } from "#validators/session/operations_validator";
import { Infer } from "@vinejs/vine/types";

export class GuardOperationSharesAreValid {
  orFail(payload: Infer<typeof Validators.Session.Operations.Schema.Operation>): void {
    const { amount, shares } = payload;

    if (shares.length < 2) {
      throw new ValidationException(["At least two shares are required."]);
    }

    const totalShares = shares.reduce((sum, s) => sum + s.share, 0);
    if (totalShares !== 100) {
      throw new ValidationException([
        `Total share percentages should be 100%, but got ${totalShares}%.`,
      ]);
    }

    const totalPaid = shares.reduce((sum, s) => sum + s.paidAmount, 0);
    if (totalPaid !== amount) {
      throw new ValidationException([
        `Total paid amount should be ${amount}, but got ${totalPaid}.`,
      ]);
    }
  }
}
