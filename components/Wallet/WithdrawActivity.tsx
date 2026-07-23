"use client";

import { MoreHorizontal, Loader, Check, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getWithdrawActivities, approveWithdrawal, rejectWithdrawal } from "@/lib/adminApi";

interface Withdrawal {
  _id: string;
  txHash?: string;
  tx?: string;
  userId?: {
    name: string;
    email: string;
  };
  recipient?: string;
  email?: string;
  asset?: string;
  assets?: string[];
  amount: string | number;
  time?: string;
  createdAt?: string;
  status: string;
  wallet?: string;
}

export default function WithdrawActivity() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const data = await getWithdrawActivities(1, 50);
      const withdrawalsList = data.data || data || [];
      setWithdrawals(Array.isArray(withdrawalsList) ? withdrawalsList : []);
      setError("");
    } catch (err: any) {
      console.error("Error fetching withdrawals:", err);
      setError(err.message || "Failed to load withdrawals");
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveWithdrawal = async (withdrawalId: string) => {
    setActionLoading(withdrawalId);
    try {
      await approveWithdrawal(withdrawalId);
      setWithdrawals(
        withdrawals.map((withdrawal) =>
          withdrawal._id === withdrawalId ? { ...withdrawal, status: "completed" } : withdrawal
        )
      );
      alert("Withdrawal approved!");
    } catch (err: any) {
      alert("Failed to approve: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectWithdrawal = async (withdrawalId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    
    setActionLoading(withdrawalId);
    try {
      await rejectWithdrawal(withdrawalId, reason);
      setWithdrawals(
        withdrawals.map((withdrawal) =>
          withdrawal._id === withdrawalId ? { ...withdrawal, status: "rejected" } : withdrawal
        )
      );
      alert("Withdrawal rejected!");
    } catch (err: any) {
      alert("Failed to reject: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const assetIcons: Record<string, string> = {
    BTC: "/assets/bit.png",
    ETH: "/assets/eth.png",
    USDT: "/assets/t.png",
  };

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}
      {loading && withdrawals.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <Loader className="inline-block animate-spin mr-2" size={20} />
          Loading withdrawals...
        </div>
      ) : (
        <table className="w-full text-sm font-Manrope">
          <thead>
            <tr className="text-left text-xs bg-[#17161E] text-gray-400">
              <th className="px-3 py-3">
                <input type="checkbox" />
              </th>
              <th className="px-3 py-3">Transaction ID</th>
              <th className="px-3 py-3">Recipient</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Assets</th>
              <th className="px-3 py-3">Total Amount</th>
              <th className="px-3 py-3">Time</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-300">
            {withdrawals.length > 0 ? (
              withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id} className="border-t cursor-pointer border-white/5 hover:bg-white/5">
                  <td className="px-3 py-4">
                    <input type="checkbox" />
                  </td>

                  <td className="px-3 py-4">{withdrawal.tx || withdrawal.txHash || withdrawal._id.substring(0, 10)}</td>
                  <td className="px-3 py-4">{withdrawal.recipient || withdrawal.userId?.name || "Unknown"}</td>
                  <td className="px-3 py-4">{withdrawal.email || withdrawal.userId?.email || "N/A"}</td>

                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      {withdrawal.assets ? (
                        withdrawal.assets.map((asset: string) => (
                          <div key={asset} className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center text-xs">
                              {asset.substring(0, 1)}
                            </div>
                            <span className="text-gray-300 text-xs">{asset}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs">{withdrawal.asset || "Unknown"}</span>
                      )}
                    </div>
                  </td>

                  <td className="px-3 py-4 text-white">{withdrawal.amount}</td>
                  <td className="px-3 py-4 text-gray-400">
                    {withdrawal.time || new Date(withdrawal.createdAt!).toLocaleDateString()}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={`rounded-lg px-3 py-1 text-xs text-white ${
                        withdrawal.status.toLowerCase() === "completed" || withdrawal.status.toLowerCase() === "successful"
                          ? "bg-[#4DCFA6]"
                          : withdrawal.status.toLowerCase() === "pending"
                            ? "bg-[#FF8D28]"
                            : "bg-red-500"
                      }`}
                    >
                      {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-3 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      {withdrawal.status.toLowerCase() === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveWithdrawal(withdrawal._id)}
                            disabled={actionLoading === withdrawal._id}
                            className="rounded-md bg-green-500/20 p-2 hover:bg-green-500/40 text-green-400 disabled:opacity-50"
                          >
                            {actionLoading === withdrawal._id ? (
                              <Loader size={16} className="animate-spin" />
                            ) : (
                              <Check size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => handleRejectWithdrawal(withdrawal._id)}
                            disabled={actionLoading === withdrawal._id}
                            className="rounded-md bg-red-500/20 p-2 hover:bg-red-500/40 text-red-400 disabled:opacity-50"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      <button className="rounded-md bg-white/5 p-2 hover:bg-white/10">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-gray-400">
                  No withdrawals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
