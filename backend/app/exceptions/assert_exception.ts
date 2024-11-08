import { SevereException } from "#exceptions/severe_exception";

export default class AssertException extends SevereException {
  static status = 500;
  static code = "E_ASSERT";

  constructor() {
    super("Something went wrong, please try again or contact us.");
  }
}
