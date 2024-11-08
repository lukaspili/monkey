import UserVaultInvitationTemplate from "#mail-templates/user_vault_invitation_template";
import { AppMail } from "#mails/app_mail";
import { PrivateUserVaultInvitation } from "#models/user_vault_invitation";
import env from "#start/env";
import { render } from "@react-email/components";

export class UserVaultInvitationMail extends AppMail {
  constructor(private invitation: PrivateUserVaultInvitation) {
    super();
  }

  prepare() {
    this.message.subject(`Join ${this.invitation.invited_by}'s vault`);
    this.sendTo(this.invitation.user.primary_email.email);

    const template = UserVaultInvitationTemplate({
      cdnUrl: env.get("REACT_EMAIL_CDN_URL"),
      invitedBy: this.invitation.invited_by,
      name: this.invitation.user.name,
      inviteUrl: `${env.get("WEB_URL")}/vault-invitations`,
    });

    this.message.html(render(template, { plainText: false }));
    this.message.text(render(template, { plainText: true }));
  }
}
