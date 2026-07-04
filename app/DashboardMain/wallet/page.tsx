import TopStats from "@/components/dashboard/TopStats";
import ActiveTabs from "@/components/Wallet/ActiveTabs";

export default function WalletFundsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-Manrope text-white">Walle & Funds</h1>

      <TopStats />

      <ActiveTabs />
    </div>
  );
}
