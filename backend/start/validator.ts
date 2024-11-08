import { normalizeFilename } from "#validators/rules/normalize_filename";
import vine, { errors, VineString } from "@vinejs/vine";
import { ErrorReporterContract, FieldContext } from "@vinejs/vine/types";

vine.convertEmptyStringsToNull = true;
vine.errorReporter = () => new ErrorReporter();

declare module "@vinejs/vine" {
  interface VineString {
    normalizeFilename(): this;
  }
}

VineString.macro("normalizeFilename", function (this: VineString) {
  return this.use(normalizeFilename());
});

// Simplified version of:
// https://github.com/vinejs/vine/blob/02d3a28048cfb96f227ee2d69a79be3087e9403e/src/reporters/simple_error_reporter.ts#L35
class ErrorReporter implements ErrorReporterContract {
  /**
   * Boolean to know one or more errors have been reported
   */
  hasErrors: boolean = false;

  /**
   * Collection of errors
   */
  errors: string[] = [];

  /**
   * Report an error.
   */
  report(
    message: string,
    _rule: string,
    _field: FieldContext,
    _meta?: Record<string, any> | undefined
  ) {
    this.hasErrors = true;
    this.errors.push(message);
  }

  /**
   * Returns an instance of the validation error
   */
  createError() {
    return new errors.E_VALIDATION_ERROR(this.errors);
  }
}
