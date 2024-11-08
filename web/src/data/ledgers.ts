import { ApiError, api } from "@/lib/api";
import { OwnerLedger } from "@/models/ledger";

export async function getLedgers(): Promise<OwnerLedger[]> {
  const response = await api<OwnerLedger[]>({
    path: "session/ledgers",
    tags: ["ledger"],
  });

  if (!response.successful) {
    throw new ApiError(response);
  }

  return response.data!;
}
