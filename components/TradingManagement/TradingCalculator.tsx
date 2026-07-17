"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import {
    calculateEquity,
    calculateFreeMargin,
    calculateMarginLevel,
    calculateMarginUsed,
    calculateTotalPnL,
    isMarginCallRisk,
    formatCurrency,
    formatPercentage,
    type AccountBalance,
    type Position,
} from "@/lib/calculators";
import { apiRequest } from "@/lib/api";

export default function TradingCalculator() {
    const [accountData, setAccountData] = useState<AccountBalance>({
        balance: 0,
        positions: [],
    });
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        equity: 0,
        marginUsed: 0,
        freeMargin: 0,
        marginLevel: 0,
        totalPnL: 0,
        isAtRisk: false,
    });

    useEffect(() => {
        fetchAccountData();
        
        // Refresh every 10 seconds
        const interval = setInterval(fetchAccountData, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Recalculate metrics whenever account data changes
        if (accountData) {
            const equity = calculateEquity(accountData);
            const marginUsed = calculateMarginUsed(accountData.positions);
            const freeMargin = calculateFreeMargin(accountData);
            const marginLevel = calculateMarginLevel(accountData);
            const totalPnL = calculateTotalPnL(accountData.positions);
            const isAtRisk = isMarginCallRisk(accountData);

            setMetrics({
                equity,
                marginUsed,
                freeMargin,
                marginLevel,
                totalPnL,
                isAtRisk,
            });
        }
    }, [accountData]);

    const fetchAccountData = async () => {
        try {
            // Fetch user balance
            const balanceData = await apiRequest("/admin/wallet/balance");
            
            // Fetch active positions
            const positionsData = await apiRequest("/admin/trades/positions");
            
            const positions: Position[] = Array.isArray(positionsData) 
                ? positionsData.map((pos: any) => ({
                    symbol: pos.symbol,
                    type: pos.type,
                    entryPrice: pos.entryPrice || pos.price,
                    currentPrice: pos.currentPrice || pos.price,
                    amount: pos.amount,
                    leverage: pos.leverage || 1,
                }))
                : [];

            setAccountData({
                balance: balanceData.balance || balanceData.totalBalance || 0,
                positions,
            });

            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch account data:", err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#0E0D15] rounded-lg p-6 border border-white/5">
                <div className="text-center text-gray-400">Loading calculator...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Margin Call Warning */}
            {metrics.isAtRisk && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                    <AlertTriangle className="text-red-500" size={24} />
                    <div>
                        <h4 className="text-red-500 font-semibold">Margin Call Risk</h4>
                        <p className="text-red-400 text-sm">
                            Your margin level is low. Consider closing positions or adding funds.
                        </p>
                    </div>
                </div>
            )}

            {/* Main Calculator Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Balance */}
                <div className="bg-[#0E0D15] rounded-lg p-4 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Balance</p>
                    <h3 className="text-2xl font-bold text-white">
                        ${formatCurrency(accountData.balance)}
                    </h3>
                </div>

                {/* Equity */}
                <div className="bg-[#0E0D15] rounded-lg p-4 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Equity</p>
                    <h3 className="text-2xl font-bold text-white">
                        ${formatCurrency(metrics.equity)}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        Balance + Unrealized P&L
                    </p>
                </div>

                {/* Margin Used */}
                <div className="bg-[#0E0D15] rounded-lg p-4 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Margin Used</p>
                    <h3 className="text-2xl font-bold text-white">
                        ${formatCurrency(metrics.marginUsed)}
                    </h3>
                </div>

                {/* Free Margin */}
                <div className="bg-[#0E0D15] rounded-lg p-4 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Free Margin</p>
                    <h3 className="text-2xl font-bold text-emerald-500">
                        ${formatCurrency(metrics.freeMargin)}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        Available for trading
                    </p>
                </div>

                {/* Margin Level */}
                <div className="bg-[#0E0D15] rounded-lg p-4 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Margin Level</p>
                    <h3
                        className={`text-2xl font-bold ${
                            metrics.marginLevel < 100
                                ? "text-red-500"
                                : metrics.marginLevel < 200
                                ? "text-yellow-500"
                                : "text-emerald-500"
                        }`}
                    >
                        {metrics.marginUsed > 0 ? formatPercentage(metrics.marginLevel) : "∞"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        {metrics.marginLevel < 100 ? "Danger" : metrics.marginLevel < 200 ? "Warning" : "Safe"}
                    </p>
                </div>

                {/* Total P&L */}
                <div className="bg-[#0E0D15] rounded-lg p-4 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Total P&L</p>
                    <div className="flex items-center gap-2">
                        {metrics.totalPnL >= 0 ? (
                            <TrendingUp className="text-emerald-500" size={20} />
                        ) : (
                            <TrendingDown className="text-red-500" size={20} />
                        )}
                        <h3
                            className={`text-2xl font-bold ${
                                metrics.totalPnL >= 0 ? "text-emerald-500" : "text-red-500"
                            }`}
                        >
                            {metrics.totalPnL >= 0 ? "+" : ""}${formatCurrency(metrics.totalPnL)}
                        </h3>
                    </div>
                </div>

                {/* Active Positions */}
                <div className="bg-[#0E0D15] rounded-lg p-4 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Active Positions</p>
                    <h3 className="text-2xl font-bold text-white">
                        {accountData.positions.length}
                    </h3>
                </div>

                {/* Utilization */}
                <div className="bg-[#0E0D15] rounded-lg p-4 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">Margin Utilization</p>
                    <h3 className="text-2xl font-bold text-white">
                        {metrics.equity > 0
                            ? formatPercentage((metrics.marginUsed / metrics.equity) * 100)
                            : "0%"}
                    </h3>
                    <div className="mt-2 bg-white/5 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full transition-all ${
                                (metrics.marginUsed / metrics.equity) * 100 > 80
                                    ? "bg-red-500"
                                    : (metrics.marginUsed / metrics.equity) * 100 > 60
                                    ? "bg-yellow-500"
                                    : "bg-emerald-500"
                            }`}
                            style={{
                                width: `${Math.min(
                                    100,
                                    (metrics.marginUsed / metrics.equity) * 100
                                )}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Formula Reference */}
            <div className="bg-[#0E0D15] rounded-lg p-4 border border-white/5">
                <h4 className="text-white font-semibold mb-3">Calculation Formulas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-400">
                    <div>
                        <span className="text-emerald-500">Equity</span> = Balance + Unrealized P&L
                    </div>
                    <div>
                        <span className="text-emerald-500">Free Margin</span> = Equity - Margin Used
                    </div>
                    <div>
                        <span className="text-emerald-500">Margin Level</span> = (Equity / Margin Used) × 100
                    </div>
                    <div>
                        <span className="text-emerald-500">Margin Used</span> = Position Size / Leverage
                    </div>
                </div>
            </div>
        </div>
    );
}
