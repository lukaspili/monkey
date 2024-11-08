import { RoutineException } from "#exceptions/routine_exception";
import { HttpContext } from "@adonisjs/core/http";

export default class ValidationException extends RoutineException {
  static status = 400;
  static code = "E_VALIDATION";

  constructor(protected errors: string[]) {
    super("Invalid input.");
  }

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({ errors: this.errors });
  }
}
