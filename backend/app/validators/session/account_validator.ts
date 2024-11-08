import vine from "@vinejs/vine";

export const SessionAccountValidator = {
  updateName: vine.compile(
    vine.object({
      name: vine.string().trim().minLength(2),
    })
  ),
  changePassword: vine.compile(
    vine.object({
      currentPassword: vine.string().minLength(6),
      newPassword: vine.string().minLength(6),
    })
  ),
};
