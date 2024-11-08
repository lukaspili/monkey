import db from "#db";
import e from "#db/edgeql/index";
import { OwnerFinancialOverviewShape } from "#models/financial_overview";
import { SessionUser } from "#models/user";
import { Data } from "#utils/data";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

export default class FinancialOverviewsController {
  @inject()
  async view({ auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;

    const data = await e
      .params({ userId: e.uuid }, ($) =>
        e
          .select(e.FinancialOverview, (financialOverview) => {
            const equalsUserId = e.op(
              financialOverview.shareholder.userContact.user.id,
              "=",
              $.userId
            );

            return {
              ...OwnerFinancialOverviewShape(financialOverview),
              filter: equalsUserId,
            };
          })
          .assert_single()
      )
      .run(db.client, { userId });

    console.log(data);

    return Data.orNotFound(data);
  }
}
