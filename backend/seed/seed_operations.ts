import db from "#db";
import ValidationException from "#exceptions/validation_exception";
import { SeedUser } from "#seed/data";
import { CreateOperationTask } from "#tasks/create_operation";
import { formatIsoDateOnly } from "#utils/date";
import { Validators } from "#validators/session/operations_validator";
import { inject } from "@adonisjs/core";
import { faker } from "@faker-js/faker";
import { SeedProcess } from "./process.js";

@inject()
export class SeedOperations extends SeedProcess {
  private user!: SeedUser;

  constructor(private createOperationTask: CreateOperationTask) {
    super();
  }

  setupFor(user: SeedUser): SeedOperations {
    this.user = user;
    return this;
  }

  run = async () => {
    await this.createOperationTest1();
    await this.createOperationTest2();
    await this.createOperationTest3();
    await this.createOperationTest4();
    await this.createOperationTest5();
    await this.createOperationTest6();
    await this.createOperationTest7();
    await this.createOperationTest8();
    await this.createOperationTest9();
    await this.createOperationTest10();
    await this.createOperationTest11();
    await this.createOperationTest12();
    await this.createOperationTest13();
  };

  // createOperations = async () => {
  //   const count = 20;

  //   for (let i = 0; i < count; ++i) {
  //     await this.createOperation();
  //   }
  // };

  createOperationTest1 = async () => {
    const title = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const amount = 200_00;
    const date = formatIsoDateOnly(faker.date.past());

    const shareholders = [{ id: this.user.shareholderId }, ...this.user.shareholders.slice(0, 3)];
    const shares = [
      {
        shareholderId: shareholders[0].id,
        share: 25,
        shareAmount: (amount * 25) / 100,
        paidAmount: 100_00,
      },
      {
        shareholderId: shareholders[1].id,
        share: 25,
        shareAmount: (amount * 25) / 100,
        paidAmount: 100_00,
      },
      {
        shareholderId: shareholders[2].id,
        share: 25,
        shareAmount: (amount * 25) / 100,
        paidAmount: 0,
      },
      {
        shareholderId: shareholders[3].id,
        share: 25,
        shareAmount: (amount * 25) / 100,
        paidAmount: 0,
      },
    ];

    const [error, payload] = await Validators.Session.Operations.create.tryValidate({
      title,
      descritpion: description,
      amount,
      date,
      shares,
    });

    if (error) {
      throw new ValidationException(error.messages);
    }

    const result = await this.createOperationTask.create(db.client, this.user.id, payload);

    this.task.update(`created operation: Test 1 - Four shareholders, equal split`);
  };

  createOperationTest2 = async () => {
    const amount = 300_00;
    const shares = [
      {
        shareholderId: this.user.shareholderId!,
        share: 33,
        shareAmount: 99_00,
        paidAmount: 150_00,
      },
      {
        shareholderId: this.user.shareholders[1].id,
        share: 33,
        shareAmount: 99_00,
        paidAmount: 150_00,
      },
      {
        shareholderId: this.user.shareholders[2].id,
        share: 34,
        shareAmount: 102_00,
        paidAmount: 0,
      },
    ];
    await this.createOperation(amount, shares);
    this.task.update(`created operation: Test 2 - Three shareholders, one debtor, two creditors`);
  };

  createOperationTest3 = async () => {
    const amount = 500_00;
    const shares = [
      {
        shareholderId: this.user.shareholderId!,
        share: 20,
        shareAmount: 100_00,
        paidAmount: 200_00,
      },
      {
        shareholderId: this.user.shareholders[1].id,
        share: 20,
        shareAmount: 100_00,
        paidAmount: 200_00,
      },
      {
        shareholderId: this.user.shareholders[2].id,
        share: 20,
        shareAmount: 100_00,
        paidAmount: 50_00,
      },
      {
        shareholderId: this.user.shareholders[3].id,
        share: 20,
        shareAmount: 100_00,
        paidAmount: 25_00,
      },
      {
        shareholderId: this.user.shareholders[4].id,
        share: 20,
        shareAmount: 100_00,
        paidAmount: 25_00,
      },
    ];
    await this.createOperation(amount, shares);
    this.task.update(`created operation: Test 3 - Five shareholders, three debtors, two creditors`);
  };

  createOperationTest4 = async () => {
    const amount = 200_00;
    const shares = [
      {
        shareholderId: this.user.shareholderId!,
        share: 50,
        shareAmount: 100_00,
        paidAmount: 200_00,
      },
      {
        shareholderId: this.user.shareholders[1].id,
        share: 50,
        shareAmount: 100_00,
        paidAmount: 0,
      },
    ];

    await this.createOperation(amount, shares);
    this.task.update(`created operation: Test 4 - Two shareholders, equal split`);
  };

  createOperationTest5 = async () => {
    const amount = 400_00;
    const shares = [
      {
        shareholderId: this.user.shareholderId!,
        share: 25,
        shareAmount: 100_00,
        paidAmount: 400_00,
      },
      {
        shareholderId: this.user.shareholders[1].id,
        share: 25,
        shareAmount: 100_00,
        paidAmount: 0,
      },
      {
        shareholderId: this.user.shareholders[2].id,
        share: 25,
        shareAmount: 100_00,
        paidAmount: 0,
      },
      {
        shareholderId: this.user.shareholders[3].id,
        share: 25,
        shareAmount: 100_00,
        paidAmount: 0,
      },
    ];
    await this.createOperation(amount, shares);
    this.task.update(`created operation: Test 5 - Four shareholders, one paid everything`);
  };

  createOperationTest6 = async () => {
    const amount = 100_00;
    const shares = [
      { shareholderId: this.user.shareholderId!, share: 50, shareAmount: 50_00, paidAmount: 60_00 },
      {
        shareholderId: this.user.shareholders[1].id,
        share: 30,
        shareAmount: 30_00,
        paidAmount: 40_00,
      },
      { shareholderId: this.user.shareholders[2].id, share: 20, shareAmount: 20_00, paidAmount: 0 },
    ];
    await this.createOperation(amount, shares);
    this.task.update(`created operation: Test 6 - Three shareholders, uneven split`);
  };

  createOperationTest7 = async () => {
    const amount = 1000_00;
    const shares = [
      {
        shareholderId: this.user.shareholderId!,
        share: 30,
        shareAmount: 300_00,
        paidAmount: 500_00,
      },
      {
        shareholderId: this.user.shareholders[1].id,
        share: 25,
        shareAmount: 250_00,
        paidAmount: 300_00,
      },
      {
        shareholderId: this.user.shareholders[2].id,
        share: 20,
        shareAmount: 200_00,
        paidAmount: 100_00,
      },
      {
        shareholderId: this.user.shareholders[3].id,
        share: 10,
        shareAmount: 100_00,
        paidAmount: 50_00,
      },
      {
        shareholderId: this.user.shareholders[4].id,
        share: 10,
        shareAmount: 100_00,
        paidAmount: 50_00,
      },
      { shareholderId: this.user.shareholders[5].id, share: 5, shareAmount: 50_00, paidAmount: 0 },
    ];
    await this.createOperation(amount, shares);
    this.task.update(`created operation: Test 7 - Six shareholders, complex distribution`);
  };

  createOperationTest8 = async () => {
    const amount = 100_00;
    const shares = [
      { shareholderId: this.user.shareholderId!, share: 50, shareAmount: 50_00, paidAmount: 51_00 },
      {
        shareholderId: this.user.shareholders[1].id,
        share: 50,
        shareAmount: 50_00,
        paidAmount: 49_00,
      },
    ];
    await this.createOperation(amount, shares);
    this.task.update(`created operation: Test 8 - Two shareholders, one paid slightly more`);
  };

  createOperationTest9 = async () => {
    const amount = 100_00;
    const shares = [
      { shareholderId: this.user.shareholderId!, share: 20, shareAmount: 20_00, paidAmount: 20_00 },
      {
        shareholderId: this.user.shareholders[1].id,
        share: 20,
        shareAmount: 20_00,
        paidAmount: 20_00,
      },
      {
        shareholderId: this.user.shareholders[2].id,
        share: 20,
        shareAmount: 20_00,
        paidAmount: 20_00,
      },
      {
        shareholderId: this.user.shareholders[3].id,
        share: 20,
        shareAmount: 20_00,
        paidAmount: 20_00,
      },
      {
        shareholderId: this.user.shareholders[4].id,
        share: 20,
        shareAmount: 20_00,
        paidAmount: 20_00,
      },
    ];
    await this.createOperation(amount, shares);
    this.task.update(`created operation: Test 9 - Five shareholders, penny rounding test`);
  };

  createOperationTest10 = async () => {
    const amount = 300_00;
    const shares = [
      {
        shareholderId: this.user.shareholderId!,
        share: 33,
        shareAmount: 99_00,
        paidAmount: 150_00,
      },
      {
        shareholderId: this.user.shareholders[1].id,
        share: 33,
        shareAmount: 99_00,
        paidAmount: 150_00,
      },
      {
        shareholderId: this.user.shareholders[2].id,
        share: 34,
        shareAmount: 102_00,
        paidAmount: 0,
      },
    ];
    await this.createOperation(amount, shares);
    this.task.update(`created operation: Test 10 - Three shareholders, one paid nothing`);
  };

  createOperationTest11 = async () => {
    const amount = 1000_00;
    const shares = [
      {
        shareholderId: this.user.shareholderId!,
        share: 70,
        shareAmount: 700_00,
        paidAmount: 200_00,
      },
      {
        shareholderId: this.user.shareholders[1].id,
        share: 20,
        shareAmount: 200_00,
        paidAmount: 300_00,
      },
      {
        shareholderId: this.user.shareholders[2].id,
        share: 5,
        shareAmount: 50_00,
        paidAmount: 400_00,
      },
      {
        shareholderId: this.user.shareholders[3].id,
        share: 5,
        shareAmount: 50_00,
        paidAmount: 100_00,
      },
    ];
    await this.createOperation(amount, shares);
    this.task.update(`created operation: Test 11 - Four shareholders, very uneven split`);
  };

  createOperationTest12 = async () => {
    const amount = 140_00; // $140.00
    const shares = [
      { shareholderId: this.user.shareholderId!, share: 33, paidAmount: 46_00 },
      { shareholderId: this.user.shareholders[1].id, share: 33, paidAmount: 47_00 },
      { shareholderId: this.user.shareholders[2].id, share: 34, paidAmount: 47_00 },
    ];
    await this.createOperation(amount, shares);
    this.task.update(
      `created operation: Test 12 - Three shareholders, uneven split with penny rounding`
    );
  };

  createOperationTest13 = async () => {
    const amount = 100_00; // $100.00
    const shares = [
      { shareholderId: this.user.shareholderId!, share: 14, shareAmount: 14_00, paidAmount: 14_29 },
      {
        shareholderId: this.user.shareholders[1].id,
        share: 14,
        shareAmount: 14_00,
        paidAmount: 14_29,
      },
      {
        shareholderId: this.user.shareholders[2].id,
        share: 14,
        shareAmount: 14_00,
        paidAmount: 14_29,
      },
      {
        shareholderId: this.user.shareholders[3].id,
        share: 14,
        shareAmount: 14_00,
        paidAmount: 14_28,
      },
      {
        shareholderId: this.user.shareholders[4].id,
        share: 14,
        shareAmount: 14_00,
        paidAmount: 14_28,
      },
      {
        shareholderId: this.user.shareholders[5].id,
        share: 15,
        shareAmount: 15_00,
        paidAmount: 14_28,
      },
      {
        shareholderId: this.user.shareholders[6].id,
        share: 15,
        shareAmount: 15_00,
        paidAmount: 14_29,
      },
    ];
    await this.createOperation(amount, shares);
    this.task.update(
      `created operation: Test 13 - Seven shareholders, uneven split with penny rounding`
    );
  };

  private createOperation = async (
    amount: number,
    shares: { shareholderId: string; share: number; paidAmount: number }[]
  ) => {
    const [error, payload] = await Validators.Session.Operations.create.tryValidate({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      amount,
      date: formatIsoDateOnly(faker.date.past()),
      shares,
    });

    if (error) {
      throw new ValidationException(error.messages);
    }

    const result = await this.createOperationTask.create(db.client, this.user.id, payload);
  };

  splitShares = (count: number) => {
    let remainingShare = 100;
    const shares = [];

    for (let i = 0; i < count; i++) {
      if (i === count - 1) {
        shares.push(remainingShare); // Assign remaining share to last element
      } else {
        const maxShare = Math.min(remainingShare - (count - i - 1) * 5, 95);
        const share = faker.number.int({ min: 5, max: maxShare });
        shares.push(share);
        remainingShare -= share;
      }
    }

    return shares;
  };
}
