"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { ArrowUp, ArrowDown } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface FutureOrder {
  _id: string;
  symbol: string;
  type: string;
  side: "buy" | "sell";
  entryPrice: number;
  currentPrice?: number;
  amount: number;
  pnl?: number;
  pnlPercent?: number;
  status: string;
  createdAt: string;
  userName?: string;
}

export default function FuturePosition() {
  const [orders, setOrders] = useState<FutureOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFutureOrders();
  }, []);

  const fetchFutureOrders = async () => {
    try {
      const data = await apiRequest("/trading/history");
      // Filter for futures trades only
      const futuresTrades = data.filter((trade: any) => trade.marketType === 'futures');
      const mappedOrders = futuresTrades.map((trade: any) => ({
        _id: trade._id,
        symbol: trade.symbol,
        type: trade.orderType || "Market",
        side: trade.type,
        entryPrice: trade.price,
        currentPrice: trade.executedPrice || trade.price,
        amount: trade.amount,
        pnl: trade.pnl,
        pnlPercent: trade.pnlPercent,
        status: trade.status?.charAt(0).toUpperCase() + trade.status?.slice(1) || "Open",
        createdAt: new Date(trade.createdAt).toLocaleDateString(),
        userName: trade.userName,
      }));
      setOrders(mappedOrders);
    } catch (err) {
      console.error("Failed to fetch future orders:", err);
      // Set empty for now
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const assetIcons: Record<string, string> = {
    BTC: "/assets/bit.png",
    ETH: "/assets/eth.png",
    USDT: "/assets/t.png",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-Manrope">
        <thead>
          <tr className="text-left text-xs bg-[#17161E] text-gray-400">
            <th className="px-3 py-3">Order ID</th>
            <th className="px-3 py-3">User ID</th>
            <th className="px-3 py-3">Pair</th>
            <th className="px-3 py-3">Type</th>
            <th className="px-3 py-3">Side</th>
            <th className="px-3 py-3">Entry Price</th>
            <th className="px-3 py-3">PnL (1%)</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Date</th>
            <th className="px-3 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="text-gray-300">
          {loading ? (
            <tr>
              <td colSpan={10} className="px-3 py-4 text-center text-gray-400">
                Loading futures positions...
              </td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-3 py-4 text-center text-gray-400">
                No futures positions found
              </td>
            </tr>
          ) : (
            orders.map((order, index) => {
              const [asset] = order.symbol.split('/');
              const pnlUp = (order.pnlPercent || 0) >= 0;
              
              return (
                <tr
                  key={order._id || index}
                  className="border-t font-Manrope cursor-pointer border-white/5 hover:bg-white/5"
                >
                  <td className="px-3 py-4">{order._id?.substring(0, 8)}...</td>
                  <td className="px-3 py-4">{order.userName || "Unknown"}</td>

                  {/* Pair column: show the full trading pair */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src={assetIcons[asset] || "/assets/default.png"}
                        alt={asset}
                        width={20}
                        height={20}
                        className="rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/default.png";
                        }}
                      />
                      <span className="text-gray-300 text-xs">{order.symbol}</span>
                    </div>
                  </td>

                  <td className="px-3 py-4 font-Manrope">{order.type}</td>
                  <td className="px-3 py-4 font-Manrope">
                    <button
                      className={`px-3 py-1 rounded-md text-xs font-Manrope ${
                        order.side === "buy"
                          ? "bg-[#00B595] text-white"
                          : "bg-[#FF383C] text-white"
                      }`}
                    >
                      {order.side === "buy" ? "Buy" : "Sell"}
                    </button>
                  </td>
                  <td className="px-3 py-4">${order.entryPrice.toFixed(2)}</td>
                  <td className="px-3 py-4 flex items-center gap-1 text-xs font-Manrope">
                    {pnlUp ? (
                      <ArrowUp size={14} className="text-[#06AE7A]" />
                    ) : (
                      <ArrowDown size={14} className="text-red-500" />
                    )}
                    <span className={pnlUp ? "text-green-500" : "text-red-500"}>
                      {order.pnlPercent ? `${(order.pnlPercent as any).toFixed(2)}%` : "0.00%"}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`rounded-lg px-3 py-1 text-xs font-Manrope ${
                        order.status === "completed"
                          ? "bg-[#00B595] text-white"
                          : order.status === "pending"
                          ? "bg-yellow-500 text-white"
                          : "bg-[#FF383C] text-white"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-gray-400">{order.createdAt}</td>
                  <td className="px-3 py-4 text-right">
                    <button className="rounded-md bg-white/5 p-2 hover:bg-white/10">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>

        <tbody className="text-gray-300">
          {/* Bottom row */}
          <tr className="bg-[#1F1F26] cursor-pointer rounded-md border-t border-white/5">
            <td
              colSpan={10}
              className="text-center text-gray-200 py-4 font-Manrope"
            >
              Force to close all orders
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
