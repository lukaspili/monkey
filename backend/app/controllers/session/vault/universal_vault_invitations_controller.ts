import db from "#db";
import { SessionUser } from "#models/user";
import { InviteUserToVaultTask } from "#tasks/invite_user_to_vault";
import { Data } from "#utils/data";
import { SessionUniversalVaultInvitationsValidator } from "#validators/session/vault/universal_vault_invitations_validator";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

export default class UniversalInvitationsController {
  @inject()
  async create({ auth, request }: HttpContext, task: InviteUserToVaultTask) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(SessionUniversalVaultInvitationsValidator.create);
    const data = await task.invite(db.client, userId, payload);

    return Data.single(data);
  }
}
