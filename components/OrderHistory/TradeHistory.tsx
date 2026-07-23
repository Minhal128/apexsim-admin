"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { getTrades } from "@/lib/adminApi";

export default function TradeHistory() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        const response = await getTrades(1, 50);
        const tradesList = response.trades || response.data || response || [];
        setTrades(Array.isArray(tradesList) ? tradesList : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch trades:', err);
        setTrades([]);
        setError('Failed to fetch trades');
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);



  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading trades...</div>
      </div>
    );
  }

  const assetIcons: Record<string, string> = {
    BTC: "/assets/bit.png",
    ETH: "/assets/eth.png",
    USDT: "/assets/t.png",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-Manrope">
        <thead>
          <tr className="text-left font-Manrope text-xs bg-[#17161E] text-gray-400">
            <th className="px-3 py-3">Trade ID</th>
            <th className="px-3 py-3">User ID</th>
            <th className="px-3 py-3">Pair</th>
            <th className="px-3 py-3">Trade Type</th>
            <th className="px-3 py-3">Side</th>
            <th className="px-3 py-3">Price</th>
            <th className="px-3 py-3">Quantity</th>
            <th className="px-3 py-3">PnL (1%)</th>
            <th className="px-3 py-3">Executed At</th>
            <th className="px-3 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="text-gray-300">
          {trades.length === 0 && (
            <tr>
              <td colSpan={10} className="px-3 py-4 text-center text-gray-400">
                No trades found
              </td>
            </tr>
          )}
          {trades.map((trade, index) => {
            const pair = Array.isArray(trade.pair) ? trade.pair[0] : (trade.pair || trade.symbol || 'BTC');
            const assetName = typeof pair === 'string' ? pair.split('/')[0] : pair;
            return (
            <tr
              key={index}
              className="border-t cursor-pointer font-Manrope border-white/5 hover:bg-white/5"
            >
              <td className="px-3 py-4 font-Manrope text-xs">{trade._id ? trade._id.substring(0,8) + '...' : trade.tradeId || 'N/A'}</td>
              <td className="px-3 py-4 font-Manrope text-xs">{trade.userId?.name || trade.userId || 'N/A'}</td>

              {/* Pair column */}
              <td className="px-3 py-4">
                <div className="flex items-center gap-1">
                  <Image
                    src={assetIcons[assetName] || assetIcons['BTC']}
                    alt={assetName}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="text-gray-300 text-xs font-Manrope">
                    {pair}
                  </span>
                </div>
              </td>

              <td className="px-3 py-4 text-xs capitalize">{trade.type || trade.tradeType || 'Limit'}</td>

              {/* Side Button */}
              <td className="px-3 py-4">
                <button
                  className={`px-3 py-1 rounded-md text-xs font-Manrope ${
                    trade.side === "Long" || trade.side === 'long'
                      ? "bg-[#00B595] text-white"
                      : "bg-[#FF383C] text-white"
                  }`}
                >
                  {trade.side || trade.type || 'Long'}
                </button>
              </td>

              <td className="px-3 py-4 text-white font-Manrope text-xs">
                {trade.price || trade.entryPrice || 'N/A'}
              </td>
              <td className="px-3 py-4 text-white font-Manrope text-xs">
                {trade.amount || trade.quantity || 'N/A'}
              </td>

              {/* PnL Column */}
              <td className="px-3 py-4 text-xs font-Manrope">
                <span
                  className={
                    trade.pnl && parseFloat(trade.pnl) >= 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {trade.pnlPercent ? `${trade.pnlPercent}%` : trade.pnl || '+0.0%'}
                </span>
              </td>

              <td className="px-3 py-4 font-Manrope text-gray-400 text-xs">
                {trade.createdAt ? new Date(trade.createdAt).toLocaleString() : 'N/A'}
              </td>

              <td className="px-3 py-4 text-right">
                <button className="rounded-md font-Manrope bg-white/5 p-2 hover:bg-white/10">
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
