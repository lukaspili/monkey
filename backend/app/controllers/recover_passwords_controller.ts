import db from "#db";
import e from "#db/edgeql/index";
import { NotFoundException } from "#exceptions/not_found_exception";
import { PublicResetUserPasswordRequestShape } from "#models/user_password_reset_request";
import { ResetUserPasswordTask } from "#tasks/reset_user_password_task";
import { Result } from "#utils/result";
import { RecoverPasswordsValidator } from "#validators/recover_passwords_validator";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

@inject()
export default class RecoverPasswordsController {
  constructor(protected resetTask: ResetUserPasswordTask) {}

  async request({ request }: HttpContext) {
    const payload = await request.validateUsing(RecoverPasswordsValidator.request);
    console.log(payload);
    const data = await this.resetTask.request(db.client, payload);
    return Result.ok(data);
  }

  async reset({ request }: HttpContext) {
    const payload = await request.validateUsing(RecoverPasswordsValidator.reset);
    const data = await this.resetTask.reset(db.client, payload);
    return Result.ok(data);
  }

  async show({ request }: HttpContext) {
    const payload = await request.validateUsing(RecoverPasswordsValidator.show);
    const {
      params: { slug },
    } = payload;

    const data = await e
      .select(e.ResetUserPasswordRequest, (_) => ({
        filter_single: { slug },
        ...PublicResetUserPasswordRequestShape(_),
      }))
      .run(db.client);

    if (!data || data.completed) {
      throw NotFoundException.of("Reset user password request");
    }

    return Result.ok(data);
  }
}
