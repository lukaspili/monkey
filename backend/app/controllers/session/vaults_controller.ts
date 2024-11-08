import db from "#db";
import e from "#db/edgeql/index";
import { SessionUser } from "#models/user";
import { ShareholderVaultShape } from "#models/vault";
import { CreateVaultTask } from "#tasks/create_vault";
import { Data } from "#utils/data";
import { Result } from "#utils/result";
import { Validators } from "#validators/session/vaults_validator";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

@inject()
export default class VaultsController {
  constructor() {}

  async list({ auth }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;

    const data = await e
      .select(e.Vault, (vault) => ({
        ...ShareholderVaultShape(vault),
        filter: e.op(vault.shareholders.user.id, "in", e.uuid(userId)),
        order_by: [{ expression: vault.created, direction: e.ASC }],
      }))
      .run(db.client);

    return Result.ok(data);
  }

  async view({ auth, request }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const {
      params: { vaultId },
    } = await request.validateUsing(Validators.Session.Vaults.view);

    const data = await e
      .params({ vaultId: e.uuid, userId: e.uuid }, ($) =>
        e
          .select(e.Vault, (vault) => {
            const equalsId = e.op(vault, "=", e.cast(e.Vault, $.vaultId));
            const isShareholder = e.op(e.cast(e.User, $.userId), "in", vault.shareholders.user);

            return {
              ...ShareholderVaultShape(vault),
              filter: e.all(e.set(equalsId, isShareholder)),
              order_by: [{ expression: vault.created, direction: e.ASC }],
            };
          })
          .assert_single()
      )
      .run(db.client, { vaultId, userId });

    return Data.orNotFound(data);
  }

  @inject()
  async create({ auth, request }: HttpContext, task: CreateVaultTask) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(Validators.Session.Vaults.create);
    const data = await task.create(db.client, userId, payload);

    return Data.single(data);
  }
}
