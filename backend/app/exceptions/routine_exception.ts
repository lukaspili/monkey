import { BaseException } from "#exceptions/base_exception";
import { HttpContext } from "@adonisjs/core/http";

// Routine exceptions are exceptions that should be logged as warnings.
export abstract class RoutineException extends BaseException {
  async report(error: this, ctx: HttpContext) {
    ctx.logger.warn({ err: error }, error.message);
  }
}
