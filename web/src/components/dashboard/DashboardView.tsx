import { AddExpenseButton } from "@/components/dashboard/AddExpenseButton";
import { AddPaymentButton } from "@/components/dashboard/AddPaymentButton";
import { FeedTableView } from "@/components/dashboard/FeedTableView";
import { FinancialOverviewView } from "@/components/dashboard/FinancialOverviewView";
import { getSessionUser } from "@/data/session";
import { greetUser } from "@/lib/messages";
import { Heading } from "catalyst/heading";

export default async function DashboardView() {
  return (
    <div>
      <HeaderView />
      <FinancialOverviewView />
      <FeedTableView />
    </div>
  );
}

async function HeaderView() {
  const user = await getSessionUser();

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-sm:w-full sm:flex-1">
        <Heading>{greetUser(user.name)}</Heading>
      </div>
      <AddPaymentButton />
      <AddExpenseButton />
    </div>
  );
}
