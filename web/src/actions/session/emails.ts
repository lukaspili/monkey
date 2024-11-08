"use server";

import { ApiResponse, api } from "@/lib/api";
import { UserEmail } from "@/models/user";
import { revalidateTag } from "next/cache";

export async function makeUserEmailPrimary(
  id: string,
  _: ApiResponse<UserEmail> | null,
  formData: FormData
): Promise<ApiResponse<UserEmail>> {
  const body = Object.fromEntries(formData);

  const response = await api<UserEmail>({
    path: `session/emails/${id}/primary`,
    method: "patch",
    body,
  });

  if (response.successful) {
    revalidateTag("session/emails");
  }

  return response;
}

export async function deleteUserEmail(
  id: string,
  _: ApiResponse<void> | null,
  formData: FormData
): Promise<ApiResponse<void>> {
  const body = Object.fromEntries(formData);

  const response = await api<void>({
    path: `session/emails/${id}`,
    method: "delete",
    body,
  });

  if (response.successful) {
    revalidateTag("session/emails");
  }

  return response;
}
