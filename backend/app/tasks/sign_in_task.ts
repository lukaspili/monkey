import e from "#db/edgeql/index";
import { UnauthorizedException } from "#exceptions/unauthorized_exception";
import { AuthSession } from "#models/auth_session";
import { SessionUserShape } from "#models/user";
import { SignInPayload } from "#payloads/sign_in_payloads";
import { assertOneResult } from "#utils/edge";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import bcrypt from "bcrypt";
import { Client } from "edgedb";
import { AuthenticateUserTask } from "./authenticate_user_task.js";

@inject()
export class SignInTask {
  constructor(protected authenticateUserTask: AuthenticateUserTask) {}

  async signIn(client: Client, payload: Infer<typeof SignInPayload>): Promise<AuthSession> {
    const { email, password } = payload;

    const findUserQuery = e.params({ email: e.str }, (params) => {
      return e
        .select(e.User, (user) => ({
          id: true,
          secret: { password_hash: true },
          filter: e.op(user.emails.email, "=", params.email),
        }))
        .assert_single();
    });

    const matchingUser = await findUserQuery.run(client, { email });
    if (!matchingUser) {
      await bcrypt.compare("foo", "bar");
      throw new UnauthorizedException("Invalid credentials.");
    }

    const validPassword = await bcrypt.compare(password, matchingUser.secret.password_hash);
    if (!validPassword) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const user = await assertOneResult(
      e
        .select(e.User, (_) => ({
          ...SessionUserShape(_),
          filter_single: { id: matchingUser.id },
        }))
        .run(client)
    );

    const token = await this.authenticateUserTask.createToken(client, user.id);

    return { user, token };
  }
}
