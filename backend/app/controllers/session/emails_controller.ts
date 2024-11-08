import db from "#db";
import e from "#db/edgeql/index";
import { NotFoundException } from "#exceptions/not_found_exception";
import { SessionUser } from "#models/user";
import { SessionUserEmailShape } from "#models/user_email";
import { DeleteUserEmailTask } from "#tasks/delete_user_email_task";
import { MakeUserEmailPrimaryTask } from "#tasks/make_user_email_primary_task";
import { Result } from "#utils/result";
import { SessionEmailsValidator } from "#validators/session/emails_validator";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

@inject()
export default class SessionEmailsController {
  constructor(
    private deleteTask: DeleteUserEmailTask,
    private makePrimaryTask: MakeUserEmailPrimaryTask
  ) {}

  async single({ auth, request }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;

    const payload = await request.validateUsing(SessionEmailsValidator.single);
    const {
      params: { id: emailId },
    } = payload;

    const data = await e
      .select(e.UserEmail, (userEmail) => {
        const equalsEmailId = e.op(userEmail.id, "=", e.uuid(emailId));
        const equalsOwnerId = e.op(userEmail.owner.id, "=", e.uuid(userId));

        return {
          ...SessionUserEmailShape(userEmail),
          filter_single: e.op(equalsEmailId, "and", equalsOwnerId),
        };
      })
      .run(db.client);

    if (!data) {
      throw NotFoundException.of("User email");
    }

    return Result.ok(data);
  }

  async list({ auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;

    const data = await e
      .select(e.UserEmail, (userEmail) => ({
        ...SessionUserEmailShape(userEmail),
        filter: e.op(userEmail.owner.id, "=", e.uuid(userId)),
        order_by: [
          { expression: userEmail.is_primary, direction: e.DESC },
          { expression: userEmail.created, direction: e.ASC },
        ],
      }))
      .run(db.client);

    return Result.ok(data);
  }

  async delete({ request, auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(SessionEmailsValidator.delete);
    const data = await this.deleteTask.delete(db.client, userId, payload);

    return Result.ok(data);
  }

  async makePrimary({ request, auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(SessionEmailsValidator.makePrimary);
    const data = await this.makePrimaryTask.makePrimary(db.client, userId, payload);

    return Result.ok(data);
  }
}
