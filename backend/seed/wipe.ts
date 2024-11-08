import db from "#db";
import e from "#db/edgeql/index";
import { SeedProcess } from "./process.js";

export class Wipe extends SeedProcess {
  run = async () => {
    await this.deleteSignUpRequests();
    await this.deleteVaults();
    await this.deleteOperations();
    await this.deleteLedgers();
    await this.deleteFinancialOverviews();
    await this.deleteShareholders();
    await this.deleteContacts();
    await this.deleteUsers();
    await this.deleteAddUserEmailRequests();
    await this.deleteResetPasswordRequests();
    await this.deleteEmailVerificationRequests();
  };

  async deleteSignUpRequests() {
    const { length } = await e.delete(e.SignUpRequest).run(db.client);
    this.task.update(`deleted sign-up requests: ${length}`);
  }

  async deleteAddUserEmailRequests() {
    const { length } = await e.delete(e.AddUserEmailRequest).run(db.client);
    this.task.update(`deleted add user email requests: ${length}`);
  }

  async deleteResetPasswordRequests() {
    const { length } = await e.delete(e.ResetUserPasswordRequest).run(db.client);
    this.task.update(`deleted reset password requests: ${length}`);
  }

  async deleteEmailVerificationRequests() {
    const { length } = await e.delete(e.EmailVerificationRequest).run(db.client);
    this.task.update(`deleted email verification requests: ${length}`);
  }

  async deleteUsers() {
    await e.delete(e.UserAvatarUpload).run(db.client);
    await e.delete(e.UserAvatar).run(db.client);
    const { length } = await e.delete(e.User).run(db.client);
    this.task.update(`deleted users: ${length}`);
  }

  async deleteVaults() {
    const { length } = await e.delete(e.Vault).run(db.client);
    this.task.update(`deleted vaults: ${length}`);
  }

  async deleteOperations() {
    const { length } = await e.delete(e.Operation).run(db.client);
    this.task.update(`deleted operations: ${length}`);
  }

  async deleteLedgers() {
    const { length } = await e.delete(e.Ledger).run(db.client);
    this.task.update(`deleted ledgers: ${length}`);
  }

  async deleteContacts() {
    const { length: length1 } = await e.delete(e.UserContact).run(db.client);
    const { length: length2 } = await e.delete(e.AnonymousContact).run(db.client);
    this.task.update(`deleted contacts: ${length1 + length2}`);
  }

  async deleteShareholders() {
    const { length } = await e.delete(e.Shareholder).run(db.client);
    this.task.update(`deleted shareholders: ${length}`);
  }

  async deleteFinancialOverviews() {
    const { length } = await e.delete(e.FinancialOverview).run(db.client);
    this.task.update(`deleted financial overviews: ${length}`);
  }
}
