import { ApiError, api } from "@/lib/api";
import { OwnerOperation } from "@/models/operation";

export async function getOperations(): Promise<OwnerOperation[]> {
  const response = await api<OwnerOperation[]>({
    path: "session/operations",
    tags: ["operation"],
  });

  if (!response.successful) {
    throw new ApiError(response);
  }

  return response.data!;
}
