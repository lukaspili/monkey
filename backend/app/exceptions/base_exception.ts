import { Exception } from "@adonisjs/core/exceptions";
import { HttpContext } from "@adonisjs/core/http";

export abstract class BaseException extends Exception {
  constructor(
    message: string,
    protected data?: Record<string, any>
  ) {
    super(message);
  }

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({ errors: [error.message] });
  }
}
