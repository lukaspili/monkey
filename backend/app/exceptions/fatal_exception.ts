import { SevereException } from "#exceptions/severe_exception";

export class FatalException extends SevereException {
  static status = 500;
  static code = "E_FATAL";
}
