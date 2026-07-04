"use client";

import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { apiRequest } from "@/lib/api";

export default function RecentTransactions() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdrawal">("deposit");
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTrades = async () => {
      try {
        const data = await apiRequest("/admin/trades");
        // Handle paginated response: { trades: [], pagination: {} }
        const tradesList = data.trades || data;
        if (Array.isArray(tradesList)) {
          setTrades(tradesList.slice(0, 5)); // Show only latest 5
        } else {
          setTrades([]);
        }
      } catch (err) {
        console.error("Failed to fetch recent trades:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentTrades();
  }, []);

  return (
    <div className="rounded-xl border border-white/10 bg-[#020617] py-6 px-4">
      <h2 className="mb-3 text-lg font-Manrope text-[#828A92]">
        Recent Activities
      </h2>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setActiveTab("deposit")}
          className={`w-full rounded-md px-3 py-3 cursor-pointer text-xs font-Manrope transition
            ${activeTab === "deposit" ? "bg-[#FFFFFF] text-black" : "bg-[#1F1F26] text-white"}`}
        >
          Recent Trades
        </button>

        <button
          onClick={() => setActiveTab("withdrawal")}
          className={`w-full rounded-md px-3 py-3 cursor-pointer text-xs font-Manrope transition
            ${activeTab === "withdrawal" ? "bg-[#FFFFFF] text-black" : "bg-[#1F1F26] text-white"}`}
        >
          Withdrawals
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-500 text-xs text-center py-4">Loading...</p>
        ) : trades.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-4">No recent activity.</p>
        ) : trades.map((trade, index) => (
          <div key={index} className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
            <FaCheckCircle className="text-[#00B595] text-lg" />
            <div className="flex-1">
              <p className="text-sm text-white font-Manrope">{trade.type === 'buy' ? 'Purchased' : 'Sold'} {trade.symbol}</p>
              <p className="text-xs text-white/60 font-Manrope">{trade.amount} units</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-Manrope text-white`}>
                ${(trade.amount * trade.price).toLocaleString()}
              </p>
              <p className="text-xs text-white/60 font-Manrope">{new Date(trade.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
