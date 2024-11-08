"use server";

import { ApiResponse, api } from "@/lib/api";
import { ResetUserPasswordRequest } from "@/models/reset-user-password-request";
import { redirect } from "next/navigation";

export async function requestUserPasswordReset(
  _: ApiResponse<ResetUserPasswordRequest> | null,
  formData: FormData
): Promise<ApiResponse<ResetUserPasswordRequest>> {
  const body = Object.fromEntries(formData);

  const response = await api<ResetUserPasswordRequest>({
    path: "passwords",
    method: "post",
    body,
  });

  return response;
}

export async function resetUserPassword(
  slug: string,
  _: ApiResponse<ResetUserPasswordRequest> | null,
  formData: FormData
): Promise<ApiResponse<ResetUserPasswordRequest>> {
  const body = Object.fromEntries(formData);

  const response = await api<ResetUserPasswordRequest>({
    path: `passwords/${slug}/reset`,
    method: "patch",
    body,
  });

  if (response.successful) {
    redirect("/sign-in");
  }

  return response;
}
