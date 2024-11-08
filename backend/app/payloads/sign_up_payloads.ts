import vine from "@vinejs/vine";

export const CreateSignUpRequestPayload = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2),
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(6),
  })
);

export const VerifySignUpRequestPayload = vine.compile(
  vine.object({
    token: vine.string(),

    params: vine.object({
      slug: vine.string(),
    }),
  })
);
