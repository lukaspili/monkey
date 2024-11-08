import { getFinancialOverview } from "@/data/financial_overviews";
import { pluralize } from "@/lib/messages";
import { formatAmount } from "@/lib/money";
import { OwnerShareholder } from "@/models/shareholder";
import { Badge } from "catalyst/badge";
import { Divider } from "catalyst/divider";
import { Subheading } from "catalyst/heading";

export async function FinancialOverviewView() {
  const financialOverview = await getFinancialOverview();

  return (
    <div>
      <div className="mt-8 flex items-end justify-between">
        <Subheading>Overview</Subheading>
        {/* <div>
          <Select name="period">
            <option value="last_week">Last week</option>
            <option value="last_two">Last two weeks</option>
            <option value="last_month">Last month</option>
            <option value="last_quarter">Last quarter</option>
          </Select>
        </div> */}
      </div>
      <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        <TotalDueView
          value={formatAmount(financialOverview.totalDueAmount)}
          count={financialOverview.totalDueShareholdersCount}
        />
        <TotalOwedView
          value={formatAmount(financialOverview.totalOwedAmount)}
          count={financialOverview.totalOwedShareholdersCount}
        />
        {financialOverview.largestDebtShareholder && (
          <LargestDebtStatView
            value={formatAmount(financialOverview.largestDebtAmount)}
            shareholder={financialOverview.largestDebtShareholder}
          />
        )}
        {financialOverview.largestCreditShareholder && (
          <LargestCreditStatView
            value={formatAmount(financialOverview.largestCreditAmount)}
            shareholder={financialOverview.largestCreditShareholder}
          />
        )}
      </div>
    </div>
  );
}

function TotalDueView({ value, count }: { value: string; count: number }) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">Total Due</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <span className="text-zinc-500">From {pluralize(count, "person", "people")}</span>
      </div>
    </div>
  );
}

function TotalOwedView({ value, count }: { value: string; count: number }) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">Total Owed</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <span className="text-zinc-500">To {pluralize(count, "person", "people")}</span>
      </div>
    </div>
  );
}

function LargestDebtStatView({
  value,
  shareholder,
}: {
  value: string;
  shareholder: OwnerShareholder;
}) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">Largest Debt</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <span className="text-zinc-500">You owe {shareholder.name}</span>
      </div>
    </div>
  );
}

function LargestCreditStatView({
  value,
  shareholder,
}: {
  value: string;
  shareholder: OwnerShareholder;
}) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">Largest Credit</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">{shareholder.name} owes you</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <Badge color={change.startsWith("+") ? "lime" : "pink"}>{change}</Badge>{" "}
        <span className="text-zinc-500">from last week</span>
      </div>
    </div>
  );
}
