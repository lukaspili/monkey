import e from "#db/edgeql/index";
import { ShareholderVault, ShareholderVaultShape } from "#models/vault";
import { assertOneResult } from "#utils/edge";
import { Validators } from "#validators/session/vaults_validator";
import { inject } from "@adonisjs/core";
import { Infer } from "@vinejs/vine/types";
import { Client } from "edgedb";

@inject()
export class CreateVaultTask {
  async create(
    client: Client,
    userId: string,
    payload: Infer<typeof Validators.Session.Vaults.create>
  ): Promise<ShareholderVault> {
    const { name } = payload;

    const vault = await client.transaction(async (tx) => {
      const { id: vaultId } = await Query.insertVault.run(tx, { userId, name });
      await Query.insertShareholder.run(tx, { userId, vaultId });

      return await assertOneResult(Query.findVault.run(tx, { vaultId }));
    });

    return vault;
  }
}

const Query = {
  insertVault: e.params({ userId: e.uuid, name: e.str }, ($) =>
    e.insert(e.Vault, {
      name: $.name,
    })
  ),

  insertShareholder: e.params({ userId: e.uuid, vaultId: e.uuid }, ($) =>
    e.insert(e.Shareholder, {
      user: e.cast(e.User, $.userId),
      vault: e.cast(e.Vault, $.vaultId),
      is_owner: true,
    })
  ),

  findVault: e.params({ vaultId: e.uuid }, ($) =>
    e.select(e.Vault, (vault) => ({
      ...ShareholderVaultShape(vault),
      filter_single: { id: $.vaultId },
    }))
  ),
};
