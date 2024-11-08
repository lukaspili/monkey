import db from "#db";
import e from "#db/edgeql/index";
import { NotFoundException } from "#exceptions/not_found_exception";
import { SessionUser } from "#models/user";
import { PublicUserAvatarShape } from "#models/user_avatar";
import { RemoveUserCurrentAvatarTask } from "#tasks/remove_user_current_avatar_task";
import { UserAvatarUploadTask } from "#tasks/user_avatar_upload_task";
import { Result } from "#utils/result";
import { SessionAvatarValidator } from "#validators/session/avatar_validator";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

@inject()
export default class SessionAvatarController {
  constructor(
    private uploadTask: UserAvatarUploadTask,
    private removeCurrentAvatarTask: RemoveUserCurrentAvatarTask
  ) {}

  async show({ request, auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const {
      params: { avatarId },
    } = await request.validateUsing(SessionAvatarValidator.show);

    const data = await e
      .params({ userId: e.uuid, avatarId: e.uuid }, ($) => {
        return e.select(e.UserAvatar, (_) => ({
          filter_single: { id: $.avatarId, user: e.cast(e.User, $.userId) },
          ...PublicUserAvatarShape(_),
        }));
      })
      .run(db.client, { userId, avatarId });

    if (!data) {
      throw NotFoundException.of("Avatar");
    }

    return Result.ok(data);
  }

  async upload({ request, auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(SessionAvatarValidator.upload);
    const data = await this.uploadTask.createUpload(db.client, userId, payload);

    return Result.ok(data);
  }

  async update({ request, auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(SessionAvatarValidator.update);
    const data = await this.uploadTask.confirmUpload(db.client, userId, payload);

    return Result.ok(data);
  }

  async remove({ auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const data = await this.removeCurrentAvatarTask.remove(db.client, userId);

    return Result.ok(data);
  }
}
