import db from "#db";
import e from "#db/edgeql/index";
import { SessionUser } from "#models/user";
import { PublicVaultRecordShape } from "#models/vault_record";
import { AddRecordToVaultTask } from "#tasks/add_record_to_vault_task";
import { Data } from "#utils/data";
import { Validators } from "#validators/session/vault/records_validator";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

@inject()
export default class VaultRecordsController {
  constructor(private readonly addRecordToVaultTask: AddRecordToVaultTask) {}

  async list({ auth, request }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const {
      params: { vaultId },
    } = await request.validateUsing(Validators.Session.Vault.Records.list);

    const data = await e
      .params({ userId: e.uuid, vaultId: e.uuid }, ($) =>
        e.select(e.VaultRecord, (record) => {
          const equalsVaultId = e.op(record.vault.id, "=", $.vaultId);
          const isShareholder = e.op(record.vault.shareholders.user.id, "in", $.userId);

          return {
            ...PublicVaultRecordShape(record),
            filter: e.op(equalsVaultId, "and", isShareholder),
            order_by: [
              { expression: record.event_date, direction: e.DESC },
              { expression: record.created, direction: e.DESC },
            ],
          };
        })
      )
      .run(db.client, { userId, vaultId });

    return Data.list(data);
  }

  async create({ auth, request }: HttpContext) {
    const { id: userId } = auth.getUserOrFail() as SessionUser;
    const payload = await request.validateUsing(Validators.Session.Vault.Records.create);

    const data = await this.addRecordToVaultTask.execute(db.client, userId, payload);

    return Data.single(data);
  }
}
