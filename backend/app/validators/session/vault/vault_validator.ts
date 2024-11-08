import vine from "@vinejs/vine";

export namespace Validators.Session {
  export const Vault = {
    view: vine.compile(
      vine.object({
        params: vine.object({
          vaultId: vine.string().uuid(),
        }),
      })
    ),

    leave: vine.compile(
      vine.object({
        params: vine.object({
          vaultId: vine.string().uuid(),
        }),
      })
    ),
  };
}
