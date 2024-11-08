import vine from "@vinejs/vine";

export namespace Validators.Session {
  export const Vaults = {
    view: vine.compile(
      vine.object({
        params: vine.object({
          vaultId: vine.string().uuid(),
        }),
      })
    ),

    create: vine.compile(
      vine.object({
        name: vine.string().minLength(2).maxLength(255),
      })
    ),
  };
}
