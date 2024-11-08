import ExternalVaultInvitationTemplate from "#mail-templates/external_vault_invitation_template";
import { AppMail } from "#mails/app_mail";
import { PrivateExternalVaultInvitation } from "#models/external_vault_invitation";
import env from "#start/env";
import { render } from "@react-email/components";

export class ExternalVaultInvitationMail extends AppMail {
  constructor(private invitation: PrivateExternalVaultInvitation) {
    super();
  }

  prepare() {
    this.message.subject(`Join ${this.invitation.invited_by}'s vault`);
    this.sendTo(this.invitation.email);

    const template = ExternalVaultInvitationTemplate({
      cdnUrl: env.get("REACT_EMAIL_CDN_URL"),
      invitedBy: this.invitation.invited_by,
      email: this.invitation.email,
      inviteUrl: `${env.get("WEB_URL")}/sign-up?invitation=${this.invitation.id}`,
    });

    this.message.html(render(template, { plainText: false }));
    this.message.text(render(template, { plainText: true }));
  }
}
