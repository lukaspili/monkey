"use server";

import { ApiResponse, api } from "@/lib/api";
import { SessionUser } from "@/models/user";
import { UserAvatarUpload } from "@/models/user-avatar-upload";
import { revalidateTag } from "next/cache";

export async function createUserAvatarUpload(payload: {
  name: string;
  mimeType: string;
  size: number;
}): Promise<ApiResponse<UserAvatarUpload>> {
  const body = payload;

  const response = await api<UserAvatarUpload>({
    path: "session/avatar/upload",
    method: "post",
    body,
  });

  return response;
}

export async function updateUserAvatar(
  _: ApiResponse<SessionUser> | null,
  formData: FormData
): Promise<ApiResponse<SessionUser>> {
  const body = Object.fromEntries(formData);

  const response = await api<SessionUser>({
    path: "session/avatar",
    method: "patch",
    body,
  });

  if (response.successful) {
    revalidateTag("session");
  }

  return response;
}

export async function removeUserAvatar(
  _: ApiResponse<SessionUser> | null,
  formData: FormData
): Promise<ApiResponse<SessionUser>> {
  const body = Object.fromEntries(formData);

  const response = await api<SessionUser>({
    path: "session/avatar",
    method: "delete",
    body,
  });

  if (response.successful) {
    revalidateTag("session");
  }

  return response;
}
