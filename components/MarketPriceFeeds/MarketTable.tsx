"use client";

import {
  Search,
  Filter,
  Upload,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Loader,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import MarketDetailModal from "./MarketDetailModal";
import { toggleMarketFeed, refreshMarketPrices } from "@/lib/adminApi";
import { apiRequest } from "@/lib/api";

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
  const [refreshing, setRefreshing] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchMarkets();
    
    // Auto-refresh prices every 30 seconds
    const interval = setInterval(() => {
      fetchRealtimePrices();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchRealtimePrices = async () => {
    try {
      const data = await apiRequest("/market/prices");
      if (data) {
        const priceMap: Record<string, any> = {};
        if (Array.isArray(data)) {
          data.forEach((p: any) => {
            priceMap[p.symbol] = p;
          });
        } else {
          Object.keys(data).forEach((symbol) => {
            priceMap[symbol] = data[symbol];
          });
        }
        
        // Update prices without full reload
        setMarkets(prevMarkets => 
          prevMarkets.map(market => {
            const updatedPrice = priceMap[market.asset] || priceMap[market.asset + 'USDT'] || priceMap[market.symbol || ''];
            if (updatedPrice) {
              return {
                ...market,
                price: updatedPrice.price || updatedPrice.usd || market.price,
                change: updatedPrice.change24h || updatedPrice.usd_24h_change || market.change,
                changeUp: (updatedPrice.change24h || updatedPrice.usd_24h_change || 0) >= 0,
                lastUpdate: new Date().toLocaleTimeString(),
              };
            }
            return market;
          })
        );
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch real-time prices:", err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshMarketPrices();
      await fetchMarkets();
      setError("");
    } catch (err: any) {
      setError("Failed to refresh prices: " + err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/market/prices");
      
      let priceArray: any[] = [];
      if (Array.isArray(data)) {
        priceArray = data;
      } else if (data && typeof data === 'object') {
        priceArray = Object.keys(data).map(symbol => ({
          symbol: symbol,
          ...data[symbol]
        }));
      }

      const transformedMarkets = priceArray.map((market: any) => {
        const symbol = market.symbol || market.id || "UNKNOWN";
        const price = market.price || market.usd || market.value || 0;
        const change = market.change24h || market.usd_24h_change || market.change || 0;
        
        return {
          _id: symbol,
          asset: symbol,
          pair: `${symbol}/USDT`,
          price: price,
          change: change,
          changeUp: parseFloat(String(change)) >= 0,
          icon: "/assets/crypto.png",
          feed: {
            name: "CoinGecko",
            icon: "/assets/bi.png",
          },
          lastUpdate: new Date().toLocaleTimeString(),
          status: true,
        };
      });

      setMarkets(transformedMarkets.length > 0 ? transformedMarkets : []);
      setLastUpdated(new Date());
      setError("");
    } catch (err: any) {
      console.error("Error fetching markets:", err);
      const errorMessage = err.message || "Failed to load market feeds";
      setError(errorMessage);
      setMarkets([]);
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
        {/* Header with Refresh Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh Prices"}
          </button>
        </div>

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
