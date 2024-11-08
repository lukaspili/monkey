import e from "#db/edgeql/index";
import { OwnerShareholder, OwnerShareholderShape } from "#models/shareholder";
import { Validators } from "#validators/session/shareholders_validator";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import { Client } from "edgedb";

@inject()
export class CreateStandaloneShareholderTask {
  create = async (
    client: Client,
    ownerId: string,
    payload: Infer<typeof Validators.Session.Shareholders.createStandalone>
  ): Promise<OwnerShareholder> => {
    const { name, initials } = payload;

    const { shareholder } = await Query.insertShareholder.run(client, {
      name,
      initials,
      ownerId,
    });

    return shareholder;
  };
}

const Query = {
  insertShareholder: e.params(
    {
      name: e.str,
      initials: e.str,
      ownerId: e.uuid,
    },
    ($) => {
      const insertedShareholder = e.insert(e.Shareholder, {
        anonymousContact: e.insert(e.AnonymousContact, {
          name: $.name,
          initials: $.initials,
          owner: e.cast(e.User, $.ownerId),
        }),
        owner: e.cast(e.User, $.ownerId),
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
