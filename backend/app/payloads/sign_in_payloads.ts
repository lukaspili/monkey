import vine from "@vinejs/vine";

export const SignInPayload = vine.compile(
  vine.object({
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(6),
  })
);
