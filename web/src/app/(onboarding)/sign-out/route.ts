import { signOut } from "@/actions/session";

export async function GET() {
  await signOut();
}
