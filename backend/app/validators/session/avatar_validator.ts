import vine from "@vinejs/vine";

export const SessionAvatarValidator = {
  show: vine.compile(
    vine.object({
      params: vine.object({
        avatarId: vine.string().uuid(),
      }),
    })
  ),
  upload: vine.compile(
    vine.object({
      name: vine.string().trim().normalizeFilename(),
      mimeType: vine.string().trim(),
      size: vine.number().positive().withoutDecimals(),
    })
  ),
  update: vine.compile(
    vine.object({
      uploadId: vine.string().uuid(),
    })
  ),
};
