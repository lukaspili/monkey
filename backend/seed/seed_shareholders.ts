import db from "#db";
import ValidationException from "#exceptions/validation_exception";
import { SeedUser } from "#seed/data";
import { CreateStandaloneShareholderTask } from "#tasks/create_standalone_shareholder";

import { Validators } from "#validators/session/shareholders_validator";
import { inject } from "@adonisjs/core";
import { faker } from "@faker-js/faker";
import { SeedProcess } from "./process.js";

@inject()
export class SeedShareholders extends SeedProcess {
  private user!: SeedUser;

  constructor(private createShareholderTask: CreateStandaloneShareholderTask) {
    super();
  }

  setupFor(user: SeedUser): SeedShareholders {
    this.user = user;
    return this;
  }

  run = async () => {
    await this.createShareholders();
  };

  createShareholders = async () => {
    const names = faker.helpers.uniqueArray(faker.person.firstName, 10);
    for (const name of names) {
      const [error, payload] = await Validators.Session.Shareholders.createStandalone.tryValidate({
        name,
      });

      if (error) {
        throw new ValidationException(error.messages);
      }

      const shareholder = await this.createShareholderTask.create(db.client, this.user.id, payload);
      this.user.shareholders.push(shareholder);
      this.task.update(`created shareholder: ${name}`);
    }
  };
}
