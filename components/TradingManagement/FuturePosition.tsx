"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";
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
  leverage?: number;
}

export default function FuturePosition() {
  const [orders, setOrders] = useState<FutureOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchFutureOrders();
    fetchMarketPrices();
    
    const interval = setInterval(() => {
      fetchFutureOrders();
      fetchMarketPrices();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchFutureOrders = async () => {
    try {
      // Use admin route to fetch all futures trades instead of just the logged-in user's trades
      const data = await apiRequest("/admin/trades/futures");
      const tradesList = data.trades || data;
      
      const mappedOrders = tradesList.map((trade: any) => ({
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
        userName: trade.userId?.name || "Unknown",
        leverage: trade.leverage || 10,
      }));
      setOrders(mappedOrders);
    } catch (err) {
      console.error("Failed to fetch future orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketPrices = async () => {
    try {
      const data = await apiRequest("/market/prices");
      if (data && typeof data === 'object') {
        const priceMap: Record<string, number> = {};
        if (Array.isArray(data)) {
          data.forEach((price: any) => {
            priceMap[price.symbol] = price.price || price.usd;
          });
        } else {
          Object.keys(data).forEach((symbol) => {
            const price = data[symbol];
            const priceValue = price.price || price.usd || price.value;
            if (priceValue) {
              priceMap[`${symbol}/USDT`] = priceValue;
            }
          });
        }
        setMarketPrices(priceMap);
      }
    } catch (err) {
      console.error("Failed to fetch market prices:", err);
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
            <th className="px-3 py-3">User</th>
            <th className="px-3 py-3">Pair</th>
            <th className="px-3 py-3">Type</th>
            <th className="px-3 py-3">Side</th>
            <th className="px-3 py-3">Entry Price</th>
            <th className="px-3 py-3">Current Price</th>
            <th className="px-3 py-3">PnL</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Date</th>
            <th className="px-3 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="text-gray-300">
          {loading ? (
            <tr>
              <td colSpan={11} className="px-3 py-4 text-center text-gray-400">
                Loading futures positions...
              </td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={11} className="px-3 py-4 text-center text-gray-400">
                No futures positions found
              </td>
            </tr>
          ) : (
            orders.map((order, index) => {
              const [asset] = order.symbol.split('/');
              
              // Dynamic PnL Calculation
              const currentPrice = marketPrices[order.symbol] || order.currentPrice || order.entryPrice;
              let computedPnl = order.pnl || 0;
              let computedPnlPercent = order.pnlPercent || 0;
              
              if (order.status.toLowerCase() === 'pending') {
                const initialMargin = (order.entryPrice * order.amount) / (order.leverage || 10);
                if (order.side === 'buy') {
                  computedPnl = (currentPrice - order.entryPrice) * order.amount;
                } else {
                  computedPnl = (order.entryPrice - currentPrice) * order.amount;
                }
                computedPnlPercent = initialMargin > 0 ? (computedPnl / initialMargin) * 100 : 0;
              }
              
              const pnlUp = computedPnl >= 0;
              
              return (
                <tr
                  key={order._id || index}
                  className="border-t font-Manrope cursor-pointer border-white/5 hover:bg-white/5"
                >
                  <td className="px-3 py-4">{order._id?.substring(0, 8)}...</td>
                  <td className="px-3 py-4">{order.userName || "Unknown"}</td>

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
                  <td className="px-3 py-4">${order.entryPrice.toFixed(4)}</td>
                  <td className="px-3 py-4">${currentPrice.toFixed(4)}</td>
                  
                  <td className="px-3 py-4 flex flex-col gap-1 text-xs font-Manrope">
                    <span className={pnlUp ? "text-green-500" : "text-red-500"}>
                      {pnlUp ? "+" : ""}{computedPnl.toFixed(2)} USDT
                    </span>
                    <div className="flex items-center gap-1">
                      {pnlUp ? (
                        <ArrowUp size={12} className="text-[#06AE7A]" />
                      ) : (
                        <ArrowDown size={12} className="text-red-500" />
                      )}
                      <span className={pnlUp ? "text-green-500" : "text-red-500"}>
                        {computedPnlPercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-3 py-4">
                    <span
                      className={`rounded-lg px-3 py-1 text-xs font-Manrope ${
                        order.status.toLowerCase() === "completed"
                          ? "bg-[#00B595] text-white"
                          : order.status.toLowerCase() === "pending"
                          ? "bg-yellow-500 text-white"
                          : "bg-[#FF383C] text-white"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-gray-400 text-xs">{order.createdAt}</td>
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
          <tr className="bg-[#1F1F26] cursor-pointer rounded-md border-t border-white/5">
            <td
              colSpan={11}
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
