import e from "#db/edgeql/index";
import { AdhocUser } from "#db/schema";

type Base = Pick<AdhocUser, "id" | "name">;

export type PublicAdhocUser = Base;

const BaseShape = e.shape(e.AdhocUser, (_) => ({
  id: true,
  name: true,
}));

export const PublicAdhocUserShape = e.shape(e.AdhocUser, (_) => ({
  ...BaseShape(_),
}));
