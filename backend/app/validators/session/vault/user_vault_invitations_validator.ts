import vine from "@vinejs/vine";

export const SessionUserVaultInvitationsValidator = {
  list: vine.compile(
    vine.object({
      params: vine.object({
        vaultId: vine.string().uuid(),
      }),
    })
  ),

  view: vine.compile(
    vine.object({
      params: vine.object({
        vaultId: vine.string().uuid(),
        invitationId: vine.string().uuid(),
      }),
    })
  ),

  delete: vine.compile(
    vine.object({
      params: vine.object({
        vaultId: vine.string().uuid(),
        invitationId: vine.string().uuid(),
      }),
    })
  ),
};
