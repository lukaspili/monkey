import vine from "@vinejs/vine";

const ShareSchema = vine.object({
  shareholderId: vine.string().uuid(),
  share: vine.number().withoutDecimals().range([0, 100]),
  paidAmount: vine.number().min(0).withoutDecimals(),
});

const OperationSchema = vine.object({
  title: vine.string().trim().minLength(2),
  descritpion: vine.string().trim().minLength(2).optional(),
  amount: vine.number().positive().withoutDecimals(),
  date: vine.date({ formats: ["YYYY-MM-DD"] }).beforeOrEqual("today"),

  shares: vine
    .array(
      vine.object({
        ...ShareSchema.getProperties(),
      })
    )
    .minLength(2) // At least 1 payer and 1 payee.
    .maxLength(20) // Cap unrealistic splits.
    .distinct("shareholderId"), // Ensure no duplicate shareholders.
});

export namespace Validators.Session {
  export const Operations = {
    Schema: {
      Operation: OperationSchema,
      Share: ShareSchema,
    },

    view: vine.compile(
      vine.object({
        params: vine.object({
          operationId: vine.string().uuid(),
        }),
      })
    ),

    create: vine.compile(
      vine.object({
        ...OperationSchema.getProperties(),
      })
    ),
  };
}
