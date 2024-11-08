import { SignUpVerifyView } from "@/components/sign-up-verify/SignUpVerifyView";
import { api } from "@/lib/api";
import { SignUpRequest } from "@/models/sign-up-request";
import { notFound } from "next/navigation";

async function getRequest(slug: string): Promise<SignUpRequest | undefined> {
  const response = await api<SignUpRequest>({ path: `sign-ups/${slug}` });
  if (!response.successful) {
    return undefined;
  }

  return response.data!;
}

export default async function SignUpVerifyPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const request = await getRequest(slug);
  if (!request) {
    notFound();
  }

  return <SignUpVerifyView request={request} />;
}
