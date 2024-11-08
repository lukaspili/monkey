import vine from "@vinejs/vine";

export namespace Validators.Session.Vault {
  export const Records = {
    list: vine.compile(
      vine.object({
        params: vine.object({
          vaultId: vine.string().uuid(),
        }),
      })
    ),

    create: vine.compile(
      vine.object({
        params: vine.object({
          vaultId: vine.string().uuid(),
        }),

        name: vine.string().trim().minLength(2),
        amount: vine.number(),
        date: vine.date(),
        shares: vine.array(
          vine.object({
            shareholderId: vine.string().uuid(),
            percentage: vine.number().min(0).max(100),
          })
        ),
      })
    ),
  };
}
