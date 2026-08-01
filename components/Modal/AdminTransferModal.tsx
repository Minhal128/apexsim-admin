"use client";

import { useState, useEffect } from "react";
import { X, ArrowRightLeft } from "lucide-react";
import { adminTransferFunds } from "@/lib/adminApi";

interface Props {
  open: boolean;
  userId: string;
  walletData: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminTransferModal({ open, userId, walletData, onClose, onSuccess }: Props) {
  const [from, setFrom] = useState<"spot" | "futures">("spot");
  const [asset, setAsset] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (open) {
      setMessage(null);
      setAmount("");
    }
  }, [open]);

  const handleSwap = () => {
    setFrom(from === "spot" ? "futures" : "spot");
  };

  const to = from === "spot" ? "futures" : "spot";

  const getAvailableBalance = () => {
    if (!walletData) return 0;
    const balances = from === "spot" ? (walletData.balances || []) : (walletData.futuresBalances || []);
    const match = balances.find((b: any) => b.asset === asset);
    return match ? match.amount : 0;
  };

  const available = getAvailableBalance();

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: 'Enter a valid amount' });
      return;
    }
    if (parseFloat(amount) > available) {
      setMessage({ type: 'error', text: 'Insufficient balance in source account' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await adminTransferFunds({
        userId,
        from,
        to,
        asset,
        amount: parseFloat(amount)
      });
      setMessage({ type: 'success', text: 'Transfer successful' });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Transfer failed' });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-3">
      <div className="w-full max-w-md rounded-2xl bg-[#0A0A10] shadow-lg border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-Manrope text-white">Transfer Funds</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleTransfer} className="p-5 space-y-6">
          {message && (
            <div className={`p-3 rounded-lg text-sm font-Manrope ${message.type === 'success' ? 'bg-[#00B595]/10 text-[#00B595]' : 'bg-[#FF383C]/10 text-[#FF383C]'}`}>
              {message.text}
            </div>
          )}

          <div className="relative flex flex-col gap-3">
            {/* From */}
            <div className="bg-[#1F1F26] rounded-lg p-3">
              <span className="text-xs text-gray-400 font-Manrope block mb-1">From</span>
              <div className="text-white font-Manrope capitalize">{from} Account</div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2A2930] border-4 border-[#0A0A10] p-1.5 rounded-full hover:bg-[#3B3A40] text-white transition-colors z-10"
            >
              <ArrowRightLeft size={14} className="rotate-90" />
            </button>

            {/* To */}
            <div className="bg-[#1F1F26] rounded-lg p-3">
              <span className="text-xs text-gray-400 font-Manrope block mb-1">To</span>
              <div className="text-white font-Manrope capitalize">{to} Account</div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 font-Manrope mb-2">Asset</label>
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="w-full bg-[#1F1F26] text-white font-Manrope rounded-lg p-3 border-none outline-none ring-1 ring-white/5 focus:ring-[#00B595]"
            >
              <option value="USDT">USDT</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="SOL">SOL</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm text-gray-400 font-Manrope">Amount</label>
              <span className="text-xs text-gray-500 font-Manrope">Available: {available.toFixed(6)} {asset}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#1F1F26] text-white font-Manrope rounded-lg p-3 pr-16 border-none outline-none ring-1 ring-white/5 focus:ring-[#00B595]"
              />
              <button
                type="button"
                onClick={() => setAmount(available.toString())}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00B595] text-sm font-medium hover:text-[#00c5a3]"
              >
                MAX
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0055FF] text-white font-Manrope py-3 rounded-lg hover:bg-[#0044CC] disabled:opacity-50 transition-colors"
          >
            {loading ? "Transferring..." : "Confirm Transfer"}
          </button>
        </form>
      </div>
    </div>
  );
}
