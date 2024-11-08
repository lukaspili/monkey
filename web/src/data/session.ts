import { ApiError, api } from "@/lib/api";
import { SessionUser, UserEmail, UserEmailRequest } from "@/models/user";
import { redirect } from "next/navigation";

export async function getSessionUser(): Promise<SessionUser> {
  const response = await api<SessionUser>({
    path: "session",
    tags: ["session"],
  });
  if (!response.successful) {
    if (response.isConnectionError) {
      throw new ApiError(response);
    } else {
      redirect("/sign-out");
    }
  }

  return response.data!;
}

export async function getUserEmails(): Promise<UserEmail[]> {
  const response = await api<UserEmail[]>({
    path: "session/emails",
    tags: ["session", "session/emails"],
  });

  if (!response.successful) {
    throw new ApiError(response);
  }

  return response.data!;
}

export async function getUserEmailRequests(): Promise<UserEmailRequest[]> {
  const response = await api<UserEmailRequest[]>({
    path: "session/email-requests",
    tags: ["session", "session/emails"],
  });

  if (!response.successful) {
    throw new ApiError(response);
  }

  return response.data!;
}
