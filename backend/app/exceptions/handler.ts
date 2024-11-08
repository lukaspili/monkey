import { UnknownException } from "#exceptions/unknown_exception";
import ValidationException from "#exceptions/validation_exception";
import { Exception } from "@adonisjs/core/exceptions";
import { ExceptionHandler, HttpContext } from "@adonisjs/core/http";
import app from "@adonisjs/core/services/app";
import { errors } from "@vinejs/vine";

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction;

  isKnownException(error: unknown): error is Exception {
    return error instanceof Exception;
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    // If the error is not standard, then we re-raise it as an UnknownException.
    if (!this.isKnownException(error)) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        throw new ValidationException(error.messages);
      }

      throw new UnknownException(error);
    }

    return super.handle(error, ctx);
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    // If the error is not standard, it will be re-raised as an UnknownException, so we don't report the initial error.
    if (!this.isKnownException(error)) {
      return;
    }

    return super.report(error, ctx);
  }
}
