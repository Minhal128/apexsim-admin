import TopStats from "@/components/dashboard/TopStats";
import TransactionChart from "@/components/dashboard/TransactionChart";
import OperationalQueues from "@/components/dashboard/OperationalQueues";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

export default function DashboardPage() {
  return (
    <div className="w-full overflow-x-hidden space-y-4">
      <h1 className="text-2xl font-Manrope text-white">Dashboard</h1>

      <TopStats />

      {/* Chart Fix */}
      <div className="overflow-x-hidden">
        <TransactionChart />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
        <OperationalQueues />
        <RecentTransactions />
      </div>
    </div>
  );
}
