import vine from "@vinejs/vine";

export const CreateAddUserEmailPayload = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
  })
);

export const VerifyAddUserEmailPayload = vine.compile(
  vine.object({
    token: vine.string(),

    params: vine.object({
      slug: vine.string(),
    }),
  })
);

export const DeleteUserEmailRequestPayload = vine.compile(
  vine.object({
    params: vine.object({
      slug: vine.string(),
    }),
  })
);
