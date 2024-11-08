import env from "#start/env";
import { Client, createClient } from "edgedb";

export default class Database {
  client: Client;

  constructor() {
    this.client = createClient().withGlobals({
      cdn_url: env.get("CDN_URL"),
      documents_directory: env.get("DOCUMENTS_DIRECTORY"),
      document_uploads_directory: env.get("DOCUMENT_UPLOADS_DIRECTORY"),
    });
  }

  async ensureConnected(): Promise<void> {
    await this.client.ensureConnected();
  }

  toggleAccessPolicies(enabled: boolean) {
    this.client = this.client.withConfig({
      apply_access_policies: enabled,
    });
  }

  configureWithSessionUser(userId: string) {
    this.client = this.client.withGlobals({
      session_user_id: userId,
      onboarding_user_email: null,
    });
  }

  configureWithOnboardingUser(email: string) {
    this.client = this.client.withGlobals({
      session_user_id: null,
      onboarding_user_email: email,
    });
  }

  resetSessions() {
    this.client = this.client.withGlobals({
      session_user_id: null,
      onboarding_user_email: null,
    });
  }
}
