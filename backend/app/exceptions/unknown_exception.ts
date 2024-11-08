import { SevereException } from "#exceptions/severe_exception";

export class UnknownException extends SevereException {
  static status = 500;
  static code = "E_UNKNOWN";

  constructor(protected underlyingError: unknown) {
    super("Something went wrong, please try again or contact us.");
  }
}
