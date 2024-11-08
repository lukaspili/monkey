import { AvatarForm } from "@/components/account/avatar/AvatarForm";
import { getSessionUser } from "@/data/session";

export async function AvatarView() {
  const user = await getSessionUser();

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-950/10">
      <AvatarForm user={user} />
    </div>
  );
}
