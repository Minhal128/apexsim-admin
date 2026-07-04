import TopStats from "@/components/dashboard/TopStats";
import MarketTable from "@/components/MarketPriceFeeds/MarketTable";

export default function MarketPriceFeedsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-Manrope text-white">Market price & feeds</h1>

      <TopStats />

      <MarketTable />
    </div>
  );
}
