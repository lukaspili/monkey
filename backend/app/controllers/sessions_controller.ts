import db from "#db";
import { SignOutTask } from "#tasks/sign_out_task";
import { Result } from "#utils/result";
import SessionValidators from "#validators/session_validators";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import { SignInTask } from "../tasks/sign_in_task.js";

@inject()
export default class SessionsController {
  constructor(
    protected signInTask: SignInTask,
    protected signOutTask: SignOutTask
  ) {}

  async signIn({ request }: HttpContext) {
    const payload = await request.validateUsing(SessionValidators.signIn);
    const data = await this.signInTask.signIn(db.client, payload);
    return Result.ok(data);
  }

  async signOut({ auth, response }: HttpContext) {
    const tokenId = auth.getUserOrFail().currentAccessToken.identifier;
    await this.signOutTask.signOut(db.client, { tokenId });
    response.noContent();
  }
}
