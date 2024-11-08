import e from "#db/edgeql/index";
import { SessionUser, SessionUserShape } from "#models/user";
import { assertOneResult } from "#utils/edge";
import { SessionAccountValidator } from "#validators/session/account_validator";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import { Client } from "edgedb";

@inject()
export class UpdateUserNameTask {
  async update(
    client: Client,
    userId: string,
    payload: Infer<typeof SessionAccountValidator.updateName>
  ): Promise<SessionUser> {
    const { name } = payload;

    const query = e.params({ id: e.uuid, name: e.str }, ($) => {
      const updated = e.update(e.User, (_) => ({
        filter_single: { id: $.id },
        set: {
          name: $.name,
        },
      }));
      return e.select(updated, (_) => ({
        ...SessionUserShape(_),
      }));
    });

    const user = await assertOneResult(query.run(client, { id: userId, name }));
    return user;
  }
}
