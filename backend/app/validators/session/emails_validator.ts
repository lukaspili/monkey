import vine from "@vinejs/vine";

export const SessionEmailsValidator = {
  single: vine.compile(
    vine.object({
      params: vine.object({
        id: vine.string().uuid(),
      }),
    })
  ),
  delete: vine.compile(
    vine.object({
      params: vine.object({
        id: vine.string().uuid(),
      }),
    })
  ),
  makePrimary: vine.compile(
    vine.object({
      params: vine.object({
        id: vine.string().uuid(),
      }),
    })
  ),
};
