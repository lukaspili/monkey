// export const CreateSignUpRequestPayload = vine.compile(
//   vine.object({
//     name: vine.string().trim(),
//     email: vine.string().email().trim().normalizeEmail(),
//     password: vine.string().minLength(6),
//   })
// );

// export const VerifySignUpRequestPayload = vine.compile(
//   vine.object({
//     id: vine.string().uuid(),
//     token: vine.string(),
//   })
// );
