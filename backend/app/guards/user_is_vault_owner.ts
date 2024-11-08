import e from "#db/edgeql/index";
import { NotFoundException } from "#exceptions/not_found_exception";
import { UnauthorizedException } from "#exceptions/unauthorized_exception";
import { Client } from "edgedb";

export class GuardUserIsVaultOwner {
  async orFail(client: Client, payload: { userId: string; vaultId: string }): Promise<void> {
    const { userId, vaultId } = payload;
    const vault = await e
      .params({ vaultId: e.uuid, userId: e.uuid }, ($) =>
        e
          // eslint-disable-next-line @typescript-eslint/no-shadow
          .select(e.Vault, (vault) => {
            const equalsVaultId = e.op(vault.id, "=", $.vaultId);
            const isShareholder = e.op($.userId, "in", vault.shareholders.user.id);

            return {
              shareholders: {
                is_owner: true,
                user: {
                  id: true,
                  name: true,
                },
              },
              filter: e.all(e.set(equalsVaultId, isShareholder)),
            };
          })
          .assert_single()
      )
      .run(client, { userId, vaultId });

    if (!vault) {
      throw NotFoundException.of("Vault");
    }

    if (
      vault.shareholders.none(
        (shareholder) => shareholder.user.id === userId && shareholder.is_owner
      )
    ) {
      throw new UnauthorizedException("You are not the owner of this vault.");
    }
  }
}
