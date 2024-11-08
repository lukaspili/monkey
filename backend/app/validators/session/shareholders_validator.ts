import { generateInitials } from "#utils/string";
import vine from "@vinejs/vine";

const shareholderSchema = vine.object({
  name: vine.string().trim().minLength(2),
  initials: vine
    .string()
    .parse((value, ctx) => value ?? generateInitials(ctx.data.name))
    .trim()
    .fixedLength(2),
});

export namespace Validators.Session {
  export const Shareholders = {
    Schema: {
      Shareholder: shareholderSchema,
    },

    view: vine.compile(
      vine.object({
        params: vine.object({
          shareholderId: vine.string().uuid(),
        }),
      })
    ),

    createStandalone: vine.compile(
      vine.object({
        ...shareholderSchema.getProperties(),
      })
    ),
  };
}
