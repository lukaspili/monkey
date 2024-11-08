"use server";

import { ApiResponse, api } from "@/lib/api";
import { UserEmailRequest } from "@/models/user";
import { revalidateTag } from "next/cache";

export async function createAddUserEmailRequest(
  _: ApiResponse<UserEmailRequest> | null,
  formData: FormData
): Promise<ApiResponse<UserEmailRequest>> {
  const body = Object.fromEntries(formData);

  const response = await api<UserEmailRequest>({
    path: "session/email-requests",
    method: "post",
    body,
  });

  if (response.successful) {
    revalidateTag("session/emails");
  }

  return response;
}

export async function verifyAddUserEmailRequest(
  slug: string,
  _: ApiResponse<UserEmailRequest> | null,
  formData: FormData
): Promise<ApiResponse<UserEmailRequest>> {
  const body = Object.fromEntries(formData);

  const response = await api<UserEmailRequest>({
    path: `session/email-requests/${slug}/verify`,
    method: "patch",
    body,
  });

  if (response.successful) {
    revalidateTag("session/emails");
  }

  return response;
}

export async function deleteUserEmailRequest(
  slug: string,
  _: ApiResponse<void> | null,
  formData: FormData
): Promise<ApiResponse<void>> {
  const body = Object.fromEntries(formData);

  const response = await api<void>({
    path: `session/email-requests/${slug}`,
    method: "delete",
    body,
  });

  if (response.successful) {
    revalidateTag("session/emails");
  }

  return response;
}
