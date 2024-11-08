import env from "#start/env";
import { BaseMail } from "@adonisjs/mail";

export abstract class AppMail extends BaseMail {
  sendTo(email: string) {
    const testModeEnabled = env.get("RESEND_TEST_MODE_ENABLED", false);
    const recipient = testModeEnabled ? "delivered@resend.dev" : email;

    this.message.to(recipient);
  }
}
