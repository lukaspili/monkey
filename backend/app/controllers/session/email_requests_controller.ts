import db from "#db";
import e from "#db/edgeql/index";
import { SessionAddUserEmailRequestShape } from "#models/add_user_email_request";
import { SessionUser } from "#models/user";
import {
  CreateAddUserEmailPayload,
  DeleteUserEmailRequestPayload,
  VerifyAddUserEmailPayload,
} from "#payloads/session/email_requests_payloads";
import { AddUserEmailTask } from "#tasks/add_user_email_task";
import { DeleteUserEmailRequestTask } from "#tasks/delete_user_email_request_task";
import { Result } from "#utils/result";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

@inject()
export default class SessionEmailRequestsController {
  constructor(
    private addUserEmailTask: AddUserEmailTask,
    private deleteRequestTask: DeleteUserEmailRequestTask
  ) {}

  async list({ auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;

    const data = await e
      .select(e.AddUserEmailRequest, (userEmail) => {
        const equalsUserId = e.op(userEmail.user.id, "=", e.uuid(userId));
        const isNotCompleted = e.op(userEmail.completed, "=", false);
        return {
          ...SessionAddUserEmailRequestShape(userEmail),
          filter: e.op(isNotCompleted, "and", equalsUserId),
        };
      })
      .run(db.client);

    return Result.ok(data);
  }

  async create({ request, auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(CreateAddUserEmailPayload);
    const data = await this.addUserEmailTask.createRequest(db.client, userId, payload);

    return Result.ok(data);
  }

  async verify({ request, auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(VerifyAddUserEmailPayload);
    const data = await this.addUserEmailTask.verifyRequest(db.client, userId, payload);

    return Result.ok(data);
  }

  async delete({ request, auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(DeleteUserEmailRequestPayload);
    const data = await this.deleteRequestTask.delete(db.client, userId, payload);

    return Result.ok(data);
  }
}
