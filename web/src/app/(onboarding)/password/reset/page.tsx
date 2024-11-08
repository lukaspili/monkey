import { ResetUserPasswordView } from "@/components/reset-user-password/ResetUserPasswordView";
import { notFound } from "next/navigation";

export default function ResetUserPasswordPage({
  searchParams = {},
}: {
  searchParams?: { slug?: string; token?: string };
}) {
  const { slug, token } = searchParams;
  if (!slug || !token) {
    notFound();
  }

  return <ResetUserPasswordView slug={slug} token={token} />;
}
