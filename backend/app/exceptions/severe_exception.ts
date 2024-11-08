import { BaseException } from "#exceptions/base_exception";
import { HttpContext } from "@adonisjs/core/http";

// Severe exceptions are exceptions that should be logged as errors.
export abstract class SevereException extends BaseException {
  async report(error: this, ctx: HttpContext) {
    ctx.logger.error({ err: error }, error.message);
  }
}
