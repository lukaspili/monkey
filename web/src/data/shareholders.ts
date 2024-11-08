import { ApiError, api } from "@/lib/api";
import { OwnerShareholder } from "@/models/shareholder";

export async function getShareholders(): Promise<OwnerShareholder[]> {
  const response = await api<OwnerShareholder[]>({
    path: "session/shareholders",
    tags: ["shareholder"],
  });

  if (!response.successful) {
    throw new ApiError(response);
  }

  return response.data!;
}
