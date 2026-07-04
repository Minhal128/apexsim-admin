"use client";

import {
  Search,
  Filter,
  Upload,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Loader,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import MarketDetailModal from "./MarketDetailModal";
import { getMarketFeeds, toggleMarketFeed } from "@/lib/adminApi";

interface Market {
  _id?: string;
  id?: string;
  asset: string;
  symbol?: string;
  icon: string;
  pair: string;
  price: string | number;
  change: string | number;
  changeUp: boolean;
  feed?: {
    name: string;
    icon?: string;
  };
  feedSource?: string;
  lastUpdate: string;
  status: boolean;
  enabled?: boolean;
}

export default function MarketTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const data = await getMarketFeeds(1, 50);
      const marketsList = data.data || data || [];
      
      // Transform API data to match UI structure
      const transformedMarkets = Array.isArray(marketsList)
        ? marketsList.map((market: any) => ({
            _id: market._id || market.id,
            asset: market.symbol || market.asset || market.pair?.split("/")[0],
            pair: market.pair || `${market.symbol || market.asset}/USDT`,
            price: market.price || "$0.00",
            change: market.change || "0%",
            changeUp: market.change ? parseFloat(String(market.change)) >= 0 : false,
            icon: market.icon || "/assets/crypto.png",
            feed: {
              name: market.feedSource || market.feed?.name || "Unknown",
              icon: market.feedIcon || "/assets/bi.png",
            },
            lastUpdate: market.lastUpdate || new Date().toLocaleTimeString(),
            status: market.enabled !== false,
          }))
        : [];

      setMarkets(transformedMarkets);
      setError("");
    } catch (err: any) {
      console.error("Error fetching markets:", err);
      setError(err.message || "Failed to load market feeds");
      // Fallback mock data
      setMarkets([
        {
          asset: "BTC",
          icon: "/assets/bit.png",
          pair: "BTC/USDT",
          price: "$45,230.76",
          change: "+0.2%",
          changeUp: true,
          feed: { name: "Binance", icon: "/assets/bi.png" },
          lastUpdate: "9:16 AM",
          status: true,
        },
        {
          asset: "ETH",
          icon: "/assets/eth.png",
          pair: "ETH/USDT",
          price: "$2,345.50",
          change: "-0.5%",
          changeUp: false,
          feed: { name: "Kraken", icon: "/assets/kr.png" },
          lastUpdate: "9:15 AM",
          status: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (marketId: string, currentStatus: boolean) => {
    setToggleLoading(marketId);
    try {
      await toggleMarketFeed(marketId, !currentStatus);
      setMarkets(
        markets.map((market) =>
          market._id === marketId ? { ...market, status: !currentStatus } : market
        )
      );
    } catch (err: any) {
      alert("Failed to update feed status: " + err.message);
    } finally {
      setToggleLoading(null);
    }
  };

  return (
    <>
      <div className="w-full rounded-md bg-[#0E0D15] border border-white/5 p-3">
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-500/10 text-red-400 text-sm">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          {loading && markets.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Loader className="inline-block animate-spin mr-2" size={20} />
              Loading market feeds...
            </div>
          ) : (
            <table className="w-full text-sm font-Manrope">
              <thead>
                <tr className="bg-[#18171B] text-xs text-gray-400">
                  <th className="px-3 py-3 text-left">Assets</th>
                  <th className="px-3 py-3 text-left">Pair</th>
                  <th className="px-3 py-3 text-left">Price</th>
                  <th className="px-3 py-3 text-left">24h Change</th>
                  <th className="px-3 py-3 text-left">Feed Source</th>
                  <th className="px-3 py-3 text-left">Last update</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {markets.length > 0 ? (
                  markets.map((item) => (
                    <tr
                      key={item._id}
                      onClick={() => {
                        setSelectedMarket(item);
                        setIsModalOpen(true);
                      }}
                      className="border-t border-white/5 text-gray-300 cursor-pointer hover:bg-white/5"
                    >
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-xs font-bold">
                            {item.asset?.substring(0, 2)}
                          </div>
                          <span>{item.asset}</span>
                        </div>
                      </td>

                      <td className="px-3 py-4">{item.pair}</td>

                      <td className="px-3 py-4 text-white">${item.price}</td>

                      <td className="px-3 py-4">
                        <div
                          className={`flex items-center gap-1 ${
                            item.changeUp ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {item.changeUp ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          )}
                          {item.change}%
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <span className="px-2 py-1 rounded-md text-xs bg-blue-500/20 text-blue-400">
                          {item.feed?.name}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-gray-400">{item.lastUpdate}</td>

                      <td className="px-3 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStatus(item._id || "", item.status);
                          }}
                          disabled={toggleLoading === item._id}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                            item.status ? "bg-emerald-500" : "bg-gray-500"
                          } disabled:opacity-50`}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-300 ${
                              item.status ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>

                      <td className="px-3 py-4 text-right">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center hover:bg-white/10 p-2 rounded-md"
                        >
                          {toggleLoading === item._id ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <MoreHorizontal size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-3 py-8 text-center text-gray-400">
                      No market feeds found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedMarket && (
        <MarketDetailModal
          market={selectedMarket}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
