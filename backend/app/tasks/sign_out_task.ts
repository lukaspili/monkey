import e from "#db/edgeql/index";
import { inject } from "@adonisjs/core";
import { Client } from "edgedb";

@inject()
export class SignOutTask {
  async signOut(client: Client, payload: { tokenId: string }): Promise<void> {
    const { tokenId } = payload;

    e.delete(e.UserAccessToken, (_) => ({ filter_single: { id: tokenId } })).run(client);
  }
}
