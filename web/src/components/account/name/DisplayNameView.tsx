import DisplayNameForm from "@/components/account/name/DisplayNameForm";
import { getSessionUser } from "@/data/session";

export default async function DisplayNameView() {
  const user = await getSessionUser();

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-950/10">
      <DisplayNameForm user={user} />
    </div>
  );
}
