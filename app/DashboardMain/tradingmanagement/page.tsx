import TopStats from "@/components/dashboard/TopStats";
import TradingActiveTabs from "@/components/TradingManagement/TradingActiveTabs";
import TradingCalculator from "@/components/TradingManagement/TradingCalculator";

export default function TradingManagementPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-Manrope text-white">Trade Management</h1>

      <TopStats />

      {/* Trading Calculator - Equity, Free Margin, Margin Level */}
      <div>
        <h2 className="text-lg font-Manrope text-white mb-3">Trading Calculator</h2>
        <TradingCalculator />
      </div>

      <TradingActiveTabs />
    </div>
  );
}
