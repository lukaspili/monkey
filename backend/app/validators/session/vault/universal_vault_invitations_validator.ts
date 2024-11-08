import vine from "@vinejs/vine";

export const SessionUniversalVaultInvitationsValidator = {
  create: vine.compile(
    vine.object({
      params: vine.object({
        vaultId: vine.string().uuid(),
      }),

      email: vine.string().email().trim().normalizeEmail(),
    })
  ),
};
