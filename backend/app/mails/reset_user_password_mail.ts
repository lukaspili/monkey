import ResetUserPasswordTemplate from "#mail-templates/reset_user_password_template";
import { AppMail } from "#mails/app_mail";
import { PrivateResetUserPasswordRequest } from "#models/user_password_reset_request";
import env from "#start/env";
import { render } from "@react-email/components";

export class ResetUserPasswordMail extends AppMail {
  subject = "Reset your password";

  constructor(private request: PrivateResetUserPasswordRequest) {
    super();
  }

  prepare() {
    this.sendTo(this.request.email);

    const template = ResetUserPasswordTemplate({
      cdnUrl: env.get("REACT_EMAIL_CDN_URL"),
      resetUrl: `${env.get("WEB_URL")}/password/reset?slug=${this.request.slug}&token=${this.request.token}`,
      name: this.request.user!.name,
    });

    this.message.html(render(template, { plainText: false }));
    this.message.text(render(template, { plainText: true }));
  }
}
