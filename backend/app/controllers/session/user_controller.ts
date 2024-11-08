import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import db from "#db";
import e from "#db/edgeql/index";
import { SessionUserShape } from "#models/user";
import { Result } from "#utils/result";

@inject()
export default class SessionUserController {
  async show({ auth }: HttpContext) {
    const userId = auth.getUserOrFail().id;

    const data = await e
      .select(e.User, (_) => ({
        ...SessionUserShape(_),
        filter_single: { id: userId },
      }))
      .run(db.client);

    return Result.ok(data);
  }
}
