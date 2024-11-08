import e from "#db/edgeql/index";
import { OwnerShareholder, OwnerShareholderShape } from "#models/shareholder";
import { inject } from "@adonisjs/core";

import { Transaction } from "edgedb/dist/transaction.js";
@inject()
export class CreateUserShareholderTask {
  create = async (client: Transaction, userId: string): Promise<OwnerShareholder> => {
    const { shareholder } = await Query.insertShareholder.run(client, {
      userId,
    });

    return shareholder;
  };
}

const Query = {
  insertShareholder: e.params(
    {
      userId: e.uuid,
    },
    ($) => {
      const insertedShareholder = e.insert(e.Shareholder, {
        userContact: e.insert(e.UserContact, {
          user: e.cast(e.User, $.userId),
          owner: e.cast(e.User, $.userId),
        }),
        owner: e.cast(e.User, $.userId),
      });

      const insertedFinancialOverview = e.insert(e.FinancialOverview, {
        shareholder: insertedShareholder,
      });

      return e.select(insertedFinancialOverview, (_) => ({
        shareholder: e.select(insertedShareholder, (_) => ({
          ...OwnerShareholderShape(_),
        })),
      }));
    }
  ),
};
