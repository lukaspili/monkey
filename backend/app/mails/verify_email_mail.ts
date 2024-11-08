import VerifyEmailTemplate from "#mail-templates/verify_email_template";
import { AppMail } from "#mails/app_mail";
import { PrivateEmailVerificationRequest } from "#models/email_verification_request";
import env from "#start/env";
import { render } from "@react-email/components";

export class VerifyEmailMail extends AppMail {
  subject = "Verify your email address";

  constructor(
    private request: PrivateEmailVerificationRequest,
    private isFromSignUp: boolean
  ) {
    super();
  }

  prepare() {
    this.sendTo(this.request.email);

    const template = VerifyEmailTemplate({
      code: this.request.token,
      cdnUrl: env.get("REACT_EMAIL_CDN_URL"),
    });

    this.message.html(render(template, { plainText: false }));
    this.message.text(render(template, { plainText: true }));
  }
}
