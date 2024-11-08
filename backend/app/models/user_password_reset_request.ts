import e from "#db/edgeql/index";
import { ResetUserPasswordRequest } from "#db/schema";

export type PublicResetUserPasswordRequest = Pick<
  ResetUserPasswordRequest,
  "id" | "slug" | "email" | "completed" | "expiration_date" | "created"
>;

export const PublicResetUserPasswordRequestShape = e.shape(e.ResetUserPasswordRequest, () => ({
  id: true,
  slug: true,
  email: true,
  completed: true,
  expiration_date: true,
  created: true,
  token: false,
}));

export type PrivateResetUserPasswordRequest = PublicResetUserPasswordRequest &
  Pick<ResetUserPasswordRequest, "token"> & { user: { id: string; name: string } | null };

export const PrivateResetUserPasswordRequestShape = e.shape(e.ResetUserPasswordRequest, (_) => ({
  ...PublicResetUserPasswordRequestShape(_),
  token: true,
  user: { id: true, name: true },
}));
