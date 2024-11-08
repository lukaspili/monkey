import {
  OwnerExternalVaultInvitation,
  PrivateExternalVaultInvitation,
} from "#models/external_vault_invitation";
import {
  OwnerUserVaultInvitation,
  PrivateUserVaultInvitation,
} from "#models/user_vault_invitation";

export type OwnerUniversalVaultInvitation =
  | { kind: "user"; invitation: OwnerUserVaultInvitation }
  | { kind: "external"; invitation: OwnerExternalVaultInvitation };

export type PrivateUniversalVaultInvitation =
  | { kind: "user"; invitation: PrivateUserVaultInvitation }
  | { kind: "external"; invitation: PrivateExternalVaultInvitation };
