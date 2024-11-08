/* eslint-disable @unicorn/no-await-expression-member */
import db from "#db";
import e from "#db/edgeql/index";
import { BaseCommand } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";

export default class TestBug extends BaseCommand {
  static commandName = "test-bug";
  static description = "";

  static options: CommandOptions = {
    startApp: true,
  };

  async prepare() {
    db.toggleAccessPolicies(false);
  }

  async completed() {
    db.toggleAccessPolicies(true);
  }

  async run() {
    const query = e.insert(e.FooEntry, {
      foo: e.insert(e.Foo, { total: 0 }),
      value: 99,
    });

    console.log(query.toEdgeQL());

    await query.run(db.client);

    // const result = await db.client.transaction(async (tx) => {
    //   // const foo1 = await e.insert(e.Foo, { total: 0 }).run(tx);

    //   await e
    //     .insert(e.FooEntry, {
    //       foo: e.insert(e.Foo, { total: 0 }),
    //       value: 99,
    //     })
    //     .run(tx);

    //   // const entries = await e
    //   //   .params(
    //   //     {
    //   //       entries: e.array(
    //   //         e.tuple({
    //   //           fooId: e.uuid,
    //   //           value: e.int64,
    //   //         })
    //   //       ),
    //   //     },
    //   //     ($) => {
    //   //       return e.for(e.array_unpack($.entries), (entry) => {
    //   //         return e.insert(e.FooEntry, {
    //   //           foo: e.cast(e.Foo, entry.fooId),
    //   //           value: entry.value,
    //   //         });
    //   //       });
    //   //     }
    //   //   )
    //   //   .run(tx, {
    //   //     entries: [
    //   //       { fooId: foo1.id, value: 10 },
    //   //       { fooId: foo1.id, value: 20 },
    //   //     ],
    //   //   });

    //   return e.select(e.Foo, () => ({ total: true })).run(tx);
    // });

    // console.log(result);
  }
}
