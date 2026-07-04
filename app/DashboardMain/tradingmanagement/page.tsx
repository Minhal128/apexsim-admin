import TopStats from "@/components/dashboard/TopStats";
import TradingActiveTabs from "@/components/TradingManagement/TradingActiveTabs";

export default function TradingManagementPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-Manrope text-white">Trade Management</h1>

      <TopStats />

      <TradingActiveTabs />
    </div>
  );
}
