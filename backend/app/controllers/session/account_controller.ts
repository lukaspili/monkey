import db from "#db";
import { SessionUser } from "#models/user";
import { UpdateUserNameTask } from "#tasks/update_user_name_task";
import { UpdateUserPasswordTask } from "#tasks/update_user_password_task";
import { Result } from "#utils/result";
import { SessionAccountValidator } from "#validators/session/account_validator";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

@inject()
export default class SessionAccountController {
  constructor(
    private updateNameTask: UpdateUserNameTask,
    private updatePasswordTask: UpdateUserPasswordTask
  ) {}

  async updateName({ request, auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(SessionAccountValidator.updateName);
    const data = await this.updateNameTask.update(db.client, userId, payload);

    return Result.ok(data);
  }

  async updatePassword({ request, auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(SessionAccountValidator.changePassword);
    const data = await this.updatePasswordTask.update(db.client, userId, payload);

    return Result.ok(data);
  }
}
