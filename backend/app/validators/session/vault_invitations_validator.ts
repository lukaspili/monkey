import vine from "@vinejs/vine";

export namespace Validators.Session {
  export const VaultInvitations = {
    list: vine.compile(
      vine.object({
        params: vine.object({
          status: vine.string().in(["pending", "archived"]),
        }),
      })
    ),

    view: vine.compile(
      vine.object({
        params: vine.object({
          invitationId: vine.string().uuid(),
        }),
      })
    ),

    accept: vine.compile(
      vine.object({
        params: vine.object({
          invitationId: vine.string().uuid(),
        }),
      })
    ),

    decline: vine.compile(
      vine.object({
        params: vine.object({
          invitationId: vine.string().uuid(),
        }),
      })
    ),
  };
}
