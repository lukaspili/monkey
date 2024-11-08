import vine from "@vinejs/vine";

const signUp = vine.compile(
  vine.object({
    name: vine.string().trim(),
    email: vine.string().email().trim().normalizeEmail(),
    password: vine.string().minLength(6),
  })
);

const signIn = vine.compile(
  vine.object({
    email: vine.string().trim(),
    password: vine.string(),
  })
);

const SessionValidators = {
  signUp,
  signIn,
};

export default SessionValidators;
