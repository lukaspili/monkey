import e from "#db/edgeql/index";
import { SessionUser, SessionUserShape } from "#models/user";
import { assertOneResult } from "#utils/edge";
import { inject } from "@adonisjs/core";
import { Client } from "edgedb";

@inject()
export class RemoveUserCurrentAvatarTask {
  constructor() {}

  async remove(client: Client, userId: string): Promise<SessionUser> {
    // Unset the current avatar and mark it for deletion.
    await assertOneResult(
      Query.unsetCurrentAvatarAndMarkForDeletion.run(client, {
        userId,
      })
    );

    // Fetch and return the updated user.
    const user: SessionUser = await assertOneResult(Query.getSessionUser.run(client, { userId }));
    return user;
  }
}

const Query = {
  unsetCurrentAvatarAndMarkForDeletion: e.params(
    {
      userId: e.uuid,
    },
    ($) => {
      return e
        .update(e.UserAvatar, (_) => ({
          filter_single: { user: e.cast(e.User, $.userId), is_current: true },
          set: {
            marked_for_deletion: true,
            is_current: false,
          },
        }))
        .assert_single();
    }
  ),

  getSessionUser: e.params({ userId: e.uuid }, ($) => {
    return e.select(e.User, (_) => ({
      filter_single: { id: $.userId },
      ...SessionUserShape(_),
    }));
  }),
};
