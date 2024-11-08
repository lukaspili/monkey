import db from "#db";
import e from "#db/edgeql/index";
import { SessionUser } from "#models/user";
import { ShareholderVaultShape } from "#models/vault";
import { LeaveVaultTask } from "#tasks/leave_vault";
import { Data } from "#utils/data";
import { Validators } from "#validators/session/vault/vault_validator";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

@inject()
export default class VaultController {
  constructor() {}

  async view({ auth, request }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const {
      params: { vaultId },
    } = await request.validateUsing(Validators.Session.Vault.view);

    const data = await e
      .params({ userId: e.uuid, vaultId: e.uuid }, ($) =>
        e
          .select(e.Vault, (vault) => {
            const equalsId = e.op(vault.id, "=", $.vaultId);
            const isShareholder = e.op(vault.shareholders.user.id, "in", $.userId);

            return {
              ...ShareholderVaultShape(vault),
              filter: e.op(equalsId, "and", isShareholder),
            };
          })
          .assert_single()
      )
      .run(db.client, { userId, vaultId });

    return Data.orNotFound(data);
  }

  @inject()
  async leave({ auth, request }: HttpContext, task: LeaveVaultTask) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(Validators.Session.Vault.leave);
    await task.leave(db.client, userId, payload);

    return Data.empty();
  }
}
