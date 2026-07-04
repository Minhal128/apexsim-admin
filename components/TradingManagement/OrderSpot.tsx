import React, { useEffect, useState } from "react";
import { MoreHorizontal, Plus, X } from "lucide-react";
import Image from "next/image";
import { ArrowUp, ArrowDown, Clock, CheckCircle, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { initializeSocket, getSocket } from "@/lib/socket";

interface Order {
    _id: string;
    orderId?: string;
    symbol: string;
    type: "buy" | "sell";
    marketType: "spot" | "futures";
    price: number;
    executedPrice?: number;
    amount: number;
    total: number;
    status: "pending" | "completed" | "cancelled";
    createdAt: string;
    executedAt?: string;
    pnl?: number;
    pnlPercent?: string | number;
    userName?: string;
}

interface MarketPrice {
    symbol: string;
    price: number;
    change24h?: number;
}

export default function OrderSpot() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPlaceOrder, setShowPlaceOrder] = useState(false);
    const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [orderMessage, setOrderMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [formData, setFormData] = useState({
        symbol: "BTC/USDT",
        type: "buy",
        marketType: "spot",
        price: "",
        amount: "",
    });

    const availablePairs = ["BTC/USDT", "ETH/USDT", "BNB/USDT"];

    // Fetch trades on component mount
    useEffect(() => {
        fetchTrades();
        fetchMarketPrices();
        initializeSocket();
        const socket = getSocket();

        if (socket) {
            // Listen for real-time trading events
            socket.on("trading:order-placed", (event: any) => {
                console.log("📍 Order placed:", event);
                setOrderMessage({ type: 'success', text: 'Order placed successfully!' });
                setOrders((prev) => [
                    {
                        _id: event.orderId,
                        symbol: event.symbol,
                        type: event.type,
                        marketType: event.marketType,
                        price: event.price,
                        amount: event.amount,
                        total: event.total,
                        status: "pending",
                        createdAt: event.createdAt,
                        userName: event.userName,
                    },
                    ...prev,
                ]);
                setTimeout(() => setOrderMessage(null), 5000);
            });

            socket.on("trading:order-executed", (event: any) => {
                console.log("✅ Order executed:", event);
                setOrders((prev) =>
                    prev.map((order) =>
                        order._id === event.orderId
                            ? {
                                ...order,
                                status: "completed",
                                executedPrice: event.executedPrice,
                                executedAt: event.executedAt,
                                pnl: event.type === "sell" ? (event.executedPrice - event.entryPrice) * event.amount : 0,
                                pnlPercent: event.type === "sell" ? ((event.executedPrice - event.entryPrice) / event.entryPrice * 100).toFixed(2) as any : undefined,
                            }
                            : order
                    )
                );
            });

            socket.on("trading:order-cancelled", (event: any) => {
                console.log("❌ Order cancelled:", event);
                setOrders((prev) =>
                    prev.map((order) =>
                        order._id === event.orderId
                            ? { ...order, status: "cancelled" }
                            : order
                    )
                );
            });
        }

        return () => {
            if (socket) {
                socket.off("trading:order-placed");
                socket.off("trading:order-executed");
                socket.off("trading:order-cancelled");
            }
        };
    }, []);

    const fetchTrades = async () => {
        try {
            const data = await apiRequest("/admin/trades");
            // Handle paginated response: { trades: [], pagination: {} }
            const tradesList = data.trades || data;
            const mappedOrders = Array.isArray(tradesList) ? tradesList.map((trade: any) => ({
                _id: trade._id,
                orderId: trade._id.substring(0, 8) + "...",
                symbol: trade.symbol,
                type: trade.type,
                marketType: trade.marketType,
                price: trade.price,
                executedPrice: trade.executedPrice || trade.price,
                amount: trade.amount,
                total: trade.total,
                status: trade.status,
                createdAt: new Date(trade.createdAt).toLocaleDateString(),
                executedAt: trade.executedAt,
                pnl: trade.pnl,
                pnlPercent: trade.pnlPercent,
            })) : [];
            setOrders(mappedOrders);
        } catch (err) {
            console.error("Failed to fetch trades:", err);
            setOrderMessage({ type: 'error', text: 'Failed to load trades' });
        } finally {
            setLoading(false);
        }
    };

    const fetchMarketPrices = async () => {
        try {
            const data = await apiRequest("/market/prices");
            if (data && typeof data === 'object') {
                const priceMap: Record<string, number> = {};
                // Handle both formats: array and object
                if (Array.isArray(data)) {
                    data.forEach((price: any) => {
                        priceMap[price.symbol] = price.price || price.usd;
                    });
                } else {
                    // Object format from market/prices endpoint
                    Object.keys(data).forEach((symbol) => {
                        const price = data[symbol];
                        // Check different price field names
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
            // Set default prices as fallback
            setMarketPrices({
                'BTC/USDT': 65000,
                'ETH/USDT': 3500,
                'BNB/USDT': 600,
            });
        }
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.price || !formData.amount) {
            setOrderMessage({ type: 'error', text: 'Please fill in all fields' });
            return;
        }

        const price = parseFloat(formData.price);
        const amount = parseFloat(formData.amount);

        if (price <= 0 || amount <= 0) {
            setOrderMessage({ type: 'error', text: 'Price and amount must be greater than 0' });
            return;
        }

        setSubmitLoading(true);
        try {
            const response = await apiRequest("/trading/order", {
                method: "POST",
                body: JSON.stringify({
                    symbol: formData.symbol,
                    type: formData.type,
                    marketType: formData.marketType,
                    price: price,
                    amount: amount,
                    orderType: "market",
                }),
            });

            console.log("Order placed successfully:", response);
            setOrderMessage({ type: 'success', text: 'Order placed successfully! Waiting for execution...' });
            setShowPlaceOrder(false);
            setFormData({
                symbol: "BTC/USDT",
                type: "buy",
                marketType: "spot",
                price: "",
                amount: "",
            });
            // Refresh trades list
            fetchTrades();
            setTimeout(() => {
                setOrderMessage(null);
            }, 5000);
        } catch (err) {
            console.error("Failed to place order:", err);
            const errorMsg = err instanceof Error ? err.message : 'Failed to place order. Please try again.';
            setOrderMessage({ type: 'error', text: errorMsg });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        try {
            await apiRequest(`/trading/cancel/${orderId}`, { method: "POST" });
            fetchTrades();
        } catch (err) {
            console.error("Failed to cancel order:", err);
            alert("Failed to cancel order");
        }
    };

    const assetIcons: Record<string, string> = {
        BTC: "/assets/bit.png",
        ETH: "/assets/eth.png",
        USDT: "/assets/t.png",
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock size={14} className="text-yellow-500" />;
            case "completed":
                return <CheckCircle size={14} className="text-green-500" />;
            case "cancelled":
                return <XCircle size={14} className="text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            {/* Place Order Button */}
            <button
                onClick={() => setShowPlaceOrder(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#00B595] text-white rounded-lg hover:bg-[#00a086] transition"
            >
                <Plus size={16} />
                Place Order
            </button>

            {/* Place Order Modal */}
            {showPlaceOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#17161E] rounded-lg p-6 w-full max-w-md border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-semibold">Place New Order</h3>
                            <button
                                onClick={() => setShowPlaceOrder(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handlePlaceOrder} className="space-y-4">
                            {/* Message Alert */}
                            {orderMessage && (
                                <div
                                    className={`p-3 rounded-lg text-sm ${orderMessage.type === 'success'
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}
                                >
                                    {orderMessage.text}
                                </div>
                            )}

                            {/* Symbol */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    Trading Pair
                                </label>
                                <select
                                    value={formData.symbol}
                                    onChange={(e) => {
                                        const symbol = e.target.value;
                                        const price = marketPrices[symbol] || '';
                                        setFormData({ ...formData, symbol, price: price.toString() });
                                    }}
                                    className="w-full bg-[#212027] text-white rounded px-3 py-2 border border-white/10"
                                >
                                    {availablePairs.map((pair) => (
                                        <option key={pair} value={pair}>
                                            {pair} {marketPrices[pair] ? `($${marketPrices[pair].toFixed(2)})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Order Type */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">
                                        Side
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                type: e.target.value as "buy" | "sell",
                                            })
                                        }
                                        className="w-full bg-[#212027] text-white rounded px-3 py-2 border border-white/10"
                                    >
                                        <option value="buy">Buy</option>
                                        <option value="sell">Sell</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">
                                        Market Type
                                    </label>
                                    <select
                                        value={formData.marketType}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                marketType: e.target.value as "spot" | "futures",
                                            })
                                        }
                                        className="w-full bg-[#212027] text-white rounded px-3 py-2 border border-white/10"
                                    >
                                        <option value="spot">Spot</option>
                                        <option value="futures">Futures</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price and Amount */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">
                                        Price (USDT)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
                                        className="w-full bg-[#212027] text-white rounded px-3 py-2 border border-white/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) =>
                                            setFormData({ ...formData, amount: e.target.value })
                                        }
                                        className="w-full bg-[#212027] text-white rounded px-3 py-2 border border-white/10"
                                    />
                                </div>
                            </div>

                            {formData.price && formData.amount && (
                                <div className="bg-[#212027] rounded p-3 text-sm">
                                    <p className="text-gray-400">
                                        Total: {(parseFloat(formData.price) * parseFloat(formData.amount)).toFixed(2)} USDT
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full bg-[#00B595] text-white py-2 rounded hover:bg-[#00a086] disabled:opacity-50 transition"
                            >
                                {submitLoading ? "Placing Order..." : "Place Order"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Orders Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm font-Manrope">
                    <thead>
                        <tr className="text-left text-xs bg-[#17161E] text-gray-400">
                            <th className="px-3 py-3">Pair</th>
                            <th className="px-3 py-3">Side</th>
                            <th className="px-3 py-3">Price</th>
                            <th className="px-3 py-3">Amount</th>
                            <th className="px-3 py-3">Status</th>
                            <th className="px-3 py-3">PnL</th>
                            <th className="px-3 py-3">Date</th>
                            <th className="px-3 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="text-gray-300">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-4">
                                    Loading orders...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-4">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const [asset] = order.symbol.split("/");
                                const icon = assetIcons[asset] || "/assets/default.png";

                                return (
                                    <tr
                                        key={order._id}
                                        className="border-t font-Manrope border-white/5 hover:bg-white/5"
                                    >
                                        <td className="px-3 py-4">
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={icon}
                                                    alt={asset}
                                                    width={20}
                                                    height={20}
                                                    className="rounded-full"
                                                />
                                                <span className="text-gray-300 text-xs">
                                                    {order.symbol}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-3 py-4">
                                            <button
                                                className={`px-3 py-1 rounded-md text-xs font-Manrope ${order.type === "buy"
                                                        ? "bg-[#00B595] text-white"
                                                        : "bg-[#FF383C] text-white"
                                                    }`}
                                            >
                                                {order.type.toUpperCase()}
                                            </button>
                                        </td>

                                        <td className="px-3 py-4 text-sm">
                                            ${order.price.toFixed(2)}
                                        </td>

                                        <td className="px-3 py-4 text-sm">
                                            {order.amount.toFixed(6)}
                                        </td>

                                        <td className="px-3 py-4">
                                            <div className="flex items-center gap-1">
                                                {getStatusIcon(order.status)}
                                                <span className="text-xs capitalize">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-3 py-4 text-sm">
                                            {order.status === "completed" && order.pnlPercent ? (
                                                <div
                                                    className={
                                                        parseFloat(String(order.pnlPercent)) >= 0
                                                            ? "text-green-500"
                                                            : "text-red-500"
                                                    }
                                                >
                                                    {parseFloat(String(order.pnlPercent)) >= 0 ? "+" : ""}
                                                    {order.pnlPercent}%
                                                </div>
                                            ) : (
                                                "-"
                                            )}
                                        </td>

                                        <td className="px-3 py-4 text-gray-400 text-xs">
                                            {order.createdAt}
                                        </td>

                                        <td className="px-3 py-4 text-right">
                                            {order.status === "pending" ? (
                                                <button
                                                    onClick={() =>
                                                        handleCancelOrder(order._id)
                                                    }
                                                    className="text-red-500 hover:text-red-400 text-xs"
                                                >
                                                    Cancel
                                                </button>
                                            ) : (
                                                <button className="rounded-md bg-white/5 p-2 hover:bg-white/10">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
