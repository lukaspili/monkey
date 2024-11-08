"use server";

import { ApiResponse, api } from "@/lib/api";
import { SessionUser } from "@/models/user";
import { revalidateTag } from "next/cache";

export async function updateUserName(
  _: ApiResponse<SessionUser> | null,
  formData: FormData
): Promise<ApiResponse<SessionUser>> {
  const body = Object.fromEntries(formData);

  const response = await api<SessionUser>({
    path: "session/account/name",
    method: "patch",
    body,
  });

  if (response.successful) {
    revalidateTag("session");
  }

  return response;
}

export async function updateUserPassword(
  _: ApiResponse<SessionUser> | null,
  formData: FormData
): Promise<ApiResponse<SessionUser>> {
  const body = Object.fromEntries(formData);

  const response = await api<SessionUser>({
    path: "session/account/password",
    method: "patch",
    body,
  });

  if (response.successful) {
    revalidateTag("session");
  }

  return response;
}
