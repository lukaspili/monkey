import vine from "@vinejs/vine";

export const RecoverPasswordsValidator = {
  request: vine.compile(
    vine.object({
      email: vine.string().email().trim().normalizeEmail(),
    })
  ),
  reset: vine.compile(
    vine.object({
      token: vine.string(),
      password: vine.string().minLength(6),
      params: vine.object({
        slug: vine.string(),
      }),
    })
  ),
  show: vine.compile(
    vine.object({
      params: vine.object({
        slug: vine.string(),
      }),
    })
  ),
};
