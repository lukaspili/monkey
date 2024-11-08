import db from "#db";
import e from "#db/edgeql/index";
import { SeedUser } from "#seed/data";
import { CreateUserShareholderTask } from "#tasks/create_user_shareholder";
import { hashPassword } from "#utils/hash";
import { generateInitials } from "#utils/string";
import { inject } from "@adonisjs/core";
import { SeedProcess } from "./process.js";

@inject()
export default class SeedTestUser extends SeedProcess {
  private user!: SeedUser;

  constructor(private readonly createUserShareholderTask: CreateUserShareholderTask) {
    super();
  }

  setupFor(user: SeedUser): SeedTestUser {
    this.user = user;
    return this;
  }

  run = async () => {
    await this.createAccount();
  };

  createAccount = async () => {
    const { name, email } = this.user;
    const initials = generateInitials(name);
    const passwordHash = await hashPassword("FooBar123");

    const { user, shareholder } = await db.client.transaction(async (tx) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const user = await e
        .insert(e.User, {
          initials,
          name,
          secret: e.insert(e.UserSecret, { password_hash: passwordHash }),
        })
        .run(tx);

      await e
        .insert(e.UserEmail, {
          email,
          is_primary: true,
          owner: e.cast(e.User, e.uuid(user.id)),
          email_verification_request: e.insert(e.EmailVerificationRequest, {
            email,
            token: "ABC-XYZ",
            verified: true,
          }),
        })
        .run(tx);

      // eslint-disable-next-line @typescript-eslint/no-shadow
      const shareholder = await this.createUserShareholderTask.create(tx, user.id);

      return { user, shareholder };
    });

    this.user.id = user.id;
    this.user.shareholderId = shareholder.id;
  };
}
