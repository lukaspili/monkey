import { ApiError, api } from "@/lib/api";
import { OwnerFinancialOverview } from "@/models/financial_overview";

export async function getFinancialOverview(): Promise<OwnerFinancialOverview> {
  const response = await api<OwnerFinancialOverview>({
    path: "session/financial-overviews",
    tags: ["financial-overview"],
  });

  if (!response.successful) {
    throw new ApiError(response);
  }

  return response.data!;
}
