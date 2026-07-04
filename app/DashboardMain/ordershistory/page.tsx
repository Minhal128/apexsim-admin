import TopStats from "@/components/dashboard/TopStats";
import OrderHistoryActiveTabs from "@/components/OrderHistory/OrderHistoryActiveTabs";

export default function OrdersHistoryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-Manrope text-white">Orders & history</h1>

      <TopStats />

      <OrderHistoryActiveTabs />
    </div>
  );
}
