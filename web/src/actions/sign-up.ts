"use server";

import { ApiResponse, api } from "@/lib/api";
import { AuthSession } from "@/models/session";
import { SignUpRequest } from "@/models/sign-up-request";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createSignUpRequest(
  _: ApiResponse | null,
  formData: FormData
): Promise<ApiResponse> {
  const body = Object.fromEntries(formData);

  const response = await api<SignUpRequest>({
    path: "sign-ups",
    method: "post",
    body,
  });

  if (response.successful) {
    const { slug } = response.data!;

    revalidatePath(`(onboarding)/sign-up/${slug}`);
    redirect(`sign-up/${slug}`);
  }

  return response;
}

export async function verifySignUpRequest(
  slug: string,
  _: ApiResponse | null,
  formData: FormData
): Promise<ApiResponse> {
  const body = Object.fromEntries(formData);

  const response = await api<AuthSession>({
    path: `sign-ups/${slug}/verify`,
    method: "patch",
    body,
  });

  if (response.successful) {
    const { token } = response.data!;
    const cookiesStore = await cookies();
    cookiesStore.set("access_token", token.token);

    // Purge all cache
    revalidatePath("/", "layout");

    redirect(`/`);
  }

  return response;
}
