"use server";

import { ApiResponse, api } from "@/lib/api";
import { AuthSession } from "@/models/session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(_: ApiResponse | null, formData: FormData): Promise<ApiResponse> {
  const body = Object.fromEntries(formData);

  const response = await api<AuthSession>({
    path: "sessions/sign-in",
    method: "post",
    body,
  });

  if (response.successful) {
    const { token } = response.data!;
    const cookiesStore = await cookies();
    cookiesStore.set("access_token", token.token);

    // Purge all cache
    revalidatePath("/", "layout");

    redirect("/");
  }

  return response;
}

export async function signOut(): Promise<never> {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;
  if (accessToken) {
    cookiesStore.delete("access_token");

    api<void>({
      method: "delete",
      path: "sessions/sign-out",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  // Purge all cache
  revalidatePath("/", "layout");

  redirect("/sign-in");
}
