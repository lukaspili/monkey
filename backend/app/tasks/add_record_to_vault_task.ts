import e from "#db/edgeql/index";
import { NotFoundException } from "#exceptions/not_found_exception";
import { PublicVaultRecord, PublicVaultRecordShape } from "#models/vault_record";
import { assertOneResult } from "#utils/edge";
import { Validators } from "#validators/session/vault/records_validator";
import { Infer } from "@vinejs/vine/types";
import { formatISO } from "date-fns";
import { Client } from "edgedb";

export class AddRecordToVaultTask {
  async execute(
    client: Client,
    userId: string,
    payload: Infer<typeof Validators.Session.Vault.Records.create>
  ): Promise<PublicVaultRecord> {
    const {
      params: { vaultId },
      name,
      amount,
      date,
      shares,
    } = payload;

    // Assert that vault exists and user is a shareholder.
    // Make it a separate query for better error handling, instead of having it included in the insert query.
    const vault = await Query.findVault.run(client, { vaultId, userId });
    if (!vault) {
      throw NotFoundException.of("Vault");
    }

    const sharesWithAmount = shares.map((share) => ({
      ...share,
      amount: (share.percentage * amount) / 100,
    }));

    // Making a single request to insert the record and shares was failing,
    // so we're doing it in a transaction ourselves. Perhaps revisit this later?
    const record = await client.transaction(async (tx) => {
      const { id: recordId } = await Query.insertRecord.run(tx, {
        vaultId: vault.id,
        name,
        amount,
        date: formatISO(date, { representation: "date" }),
      });

      await Query.insertShares.run(tx, {
        recordId,
        shares: sharesWithAmount,
      });

      // Fetch the record again once the shares are inserted.
      return assertOneResult(Query.findRecordWithShares.run(tx, { recordId }));
    });

    return record;
  }
}

const Query = {
  findVault: e.params({ vaultId: e.uuid, userId: e.uuid }, ($) =>
    e
      .select(e.Vault, (vault) => {
        const equalsId = e.op(vault.id, "=", $.vaultId);
        const isShareholder = e.op(vault.shareholders.user.id, "in", $.userId);
        return {
          id: true,
          filter: e.op(equalsId, "and", isShareholder),
        };
      })
      .assert_single()
  ),

  insertRecord: e.params(
    {
      vaultId: e.uuid,
      name: e.str,
      amount: e.int64,
      date: e.str,
    },
    ($) =>
      e.insert(e.VaultRecord, {
        name: $.name,
        amount: $.amount,
        event_date: e.cal.to_local_date($.date),
        vault: e.cast(e.Vault, $.vaultId),
      })
  ),

  insertShares: e.params(
    {
      recordId: e.uuid,
      shares: e.array(e.tuple({ shareholderId: e.uuid, percentage: e.int64, amount: e.int64 })),
    },
    ($) =>
      e.for(e.array_unpack($.shares), (share) =>
        e.insert(e.VaultRecordShare, {
          amount: share.amount,
          percentage: share.percentage,
          record: e.cast(e.VaultRecord, $.recordId),
          shareholder: e.cast(e.VaultShareholder, share.shareholderId),
        })
      )
  ),

  findRecordWithShares: e.params({ recordId: e.uuid }, ($) =>
    e.select(e.VaultRecord, (_) => ({
      ...PublicVaultRecordShape(_),
      filter_single: { id: $.recordId },
    }))
  ),
};
