/* eslint-disable @unicorn/no-await-expression-member */
import db from "#db";
import { SeedData, SeedUser } from "#seed/data";
import { SeedOperations } from "#seed/seed_operations";
import { SeedShareholders } from "#seed/seed_shareholders";
import SeedTestUser from "#seed/seed_test_user";
import { Wipe } from "#seed/wipe";
import { BaseCommand } from "@adonisjs/core/ace";
import app from "@adonisjs/core/services/app";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import { TaskManager } from "@poppinss/cliui";

export default class Seed extends BaseCommand {
  static commandName = "seed";
  static description = "";

  static options: CommandOptions = {
    startApp: true,
  };

  private tasks!: TaskManager;

  async prepare() {
    db.toggleAccessPolicies(false);
  }

  async completed() {
    db.toggleAccessPolicies(true);
  }

  async run() {
    this.tasks = this.ui.tasks({ verbose: true });

    this.tasks.add("Wipe previous data", new Wipe().process);

    await this.seedUser(SeedData.alice);
    // await this.seedUser(SeedData.john);

    await this.seedShareholders(SeedData.alice);

    await this.seedOperations(SeedData.alice);
    // await this.seedOperations(SeedData.john);

    await this.tasks.run();
  }

  seedUser = async (user: SeedUser) => {
    const seedUser = (await app.container.make(SeedTestUser)).setupFor(user);
    this.tasks.add(`Seed user: ${user.name} <${user.email}>`, seedUser.process);
  };

  seedShareholders = async (user: SeedUser) => {
    const seedShareholders = (await app.container.make(SeedShareholders)).setupFor(user);
    this.tasks.add(`Seed shareholders for: ${user.name}`, seedShareholders.process);
  };

  seedOperations = async (user: SeedUser) => {
    const seedOperations = (await app.container.make(SeedOperations)).setupFor(user);
    this.tasks.add(`Seed operations for: ${user.name}`, seedOperations.process);
  };
}
