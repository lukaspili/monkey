/* eslint-disable @typescript-eslint/naming-convention */

/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from "#start/kernel";
import router from "@adonisjs/core/services/router";

const HealthChecksController = () => import("#controllers/health_checks_controller");
const SignUpsController = () => import("#controllers/sign_ups_controller");
const RecoverPasswordsController = () => import("#controllers/recover_passwords_controller");
const SessionsController = () => import("#controllers/sessions_controller");
const SessionUserController = () => import("#controllers/session/user_controller");
const SessionAccountController = () => import("#controllers/session/account_controller");
const SessionAvatarController = () => import("#controllers/session/avatar_controller");
const SessionEmailsController = () => import("#controllers/session/emails_controller");
const SessionEmailRequestsController = () =>
  import("#controllers/session/email_requests_controller");

const Session_OperationsController = () => import("#controllers/session/operations_controller");
const Session_ShareholdersController = () => import("#controllers/session/shareholders_controller");
const Session_FinancialOverviewsController = () =>
  import("#controllers/session/financial_overviews_controller");
const Session_LedgersController = () => import("#controllers/session/ledgers_controller");

const Session_VaultsController = () => import("#controllers/session/vaults_controller");

const Session_Vault_VaultController = () => import("#controllers/session/vault/vault_controller");
const Session_Vault_RecordsController = () =>
  import("#controllers/session/vault/records_controller");
const Session_Vault_UniversalInvitationsController = () =>
  import("#controllers/session/vault/universal_vault_invitations_controller");
const Session_Vault_UserInvitationsController = () =>
  import("#controllers/session/vault/user_invitations_controller");
const Session_Vault_ExternalInvitationsController = () =>
  import("#controllers/session/vault/external_invitations_controller");

const Session_VaultInvitationsController = () =>
  import("#controllers/session/vault_invitations_controller");

router.get("/health", [HealthChecksController]);

router.get("/", async () => {
  return {
    hello: "world",
  };
});

router
  .group(() => {
    router.post("", [SignUpsController, "create"]);
    router.get(":slug", [SignUpsController, "show"]);
    router.patch(":slug/verify", [SignUpsController, "verify"]);
  })
  .prefix("sign-ups");

router
  .group(() => {
    router.post("", [RecoverPasswordsController, "request"]);
    router.patch(":slug/reset", [RecoverPasswordsController, "reset"]);
    router.get(":slug", [RecoverPasswordsController, "show"]);
  })
  .prefix("passwords");

router
  .group(() => {
    router.post("sign-in", [SessionsController, "signIn"]);
    router.delete("sign-out", [SessionsController, "signOut"]).use(middleware.auth());
  })
  .prefix("sessions");

router
  .group(() => {
    router.get("", [SessionUserController, "show"]);
  })
  .prefix("session")
  .middleware(middleware.auth());

router
  .group(() => {
    router.patch("name", [SessionAccountController, "updateName"]);
    router.patch("password", [SessionAccountController, "updatePassword"]);
  })
  .prefix("session/account")
  .middleware(middleware.auth());

router
  .group(() => {
    router.get(":id", [SessionAvatarController, "show"]);
    router.patch("", [SessionAvatarController, "update"]);
    router.delete("", [SessionAvatarController, "remove"]);
    router.post("upload", [SessionAvatarController, "upload"]);
  })
  .prefix("session/avatar")
  .middleware(middleware.auth());

router
  .group(() => {
    router.get("", [SessionEmailsController, "list"]);
    router.get(":id", [SessionEmailsController, "single"]);
    router.delete(":id", [SessionEmailsController, "delete"]);
    router.patch(":id/primary", [SessionEmailsController, "makePrimary"]);
  })
  .prefix("session/emails")
  .middleware(middleware.auth());

router
  .group(() => {
    router.get("", [SessionEmailRequestsController, "list"]);
    router.post("", [SessionEmailRequestsController, "create"]);
    router.patch(":slug/verify", [SessionEmailRequestsController, "verify"]);
    router.delete(":slug", [SessionEmailRequestsController, "delete"]);
  })
  .prefix("session/email-requests")
  .middleware(middleware.auth());

router
  .group(() => {
    router.get("", [Session_OperationsController, "list"]);
    router.post("", [Session_OperationsController, "create"]);
  })
  .prefix("session/operations")
  .middleware(middleware.auth());

router
  .group(() => {
    router.get("", [Session_ShareholdersController, "list"]);
    router.post("", [Session_ShareholdersController, "createStandalone"]);
  })
  .prefix("session/shareholders")
  .middleware(middleware.auth());

router
  .group(() => {
    router.get("", [Session_FinancialOverviewsController, "view"]);
  })
  .prefix("session/financial-overviews")
  .middleware(middleware.auth());

router
  .group(() => {
    router.get("", [Session_LedgersController, "list"]);
  })
  .prefix("session/ledgers")
  .middleware(middleware.auth());

router
  .group(() => {
    router.get("", [Session_VaultsController, "list"]);
    router.post("", [Session_VaultsController, "create"]);
  })
  .prefix("session/vaults")
  .middleware(middleware.auth());

router
  .group(() => {
    router.get("filter/:status", [Session_VaultInvitationsController, "list"]);
    router.get(":invitationId", [Session_VaultInvitationsController, "view"]);
    router.post(":invitationId/accept", [Session_VaultInvitationsController, "accept"]);
    router.post(":invitationId/decline", [Session_VaultInvitationsController, "decline"]);
  })
  .prefix("session/vault-invitations")
  .middleware(middleware.auth());

router
  .group(() => {
    router.get("", [Session_Vault_VaultController, "view"]);
    router.delete("", [Session_Vault_VaultController, "leave"]);
  })
  .prefix("session/vaults/:vaultId")
  .middleware(middleware.auth());

router
  .group(() => {
    router.get("", [Session_Vault_RecordsController, "list"]);
    router.post("", [Session_Vault_RecordsController, "create"]);
  })
  .prefix("session/vaults/:vaultId/records")
  .middleware(middleware.auth());

router
  .group(() => {
    router.post("", [Session_Vault_UniversalInvitationsController, "create"]);
  })
  .prefix("session/vaults/:vaultId/invitations")
  .middleware(middleware.auth());

router
  .group(() => {
    router.get("", [Session_Vault_UserInvitationsController, "list"]);
    router.get(":invitationId", [Session_Vault_UserInvitationsController, "view"]);
    router.delete(":invitationId", [Session_Vault_UserInvitationsController, "delete"]);
  })
  .prefix("session/vaults/:vaultId/invitations/user")
  .middleware(middleware.auth());

router
  .group(() => {
    router.get("", [Session_Vault_ExternalInvitationsController, "list"]);
    router.get(":invitationId", [Session_Vault_ExternalInvitationsController, "view"]);
    router.delete(":invitationId", [Session_Vault_ExternalInvitationsController, "delete"]);
  })
  .prefix("session/vaults/:vaultId/invitations/external")
  .middleware(middleware.auth());
