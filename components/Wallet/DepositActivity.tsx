"use client";

import { MoreHorizontal, Loader, Check, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getDepositActivities, approveDeposit, rejectDeposit } from "@/lib/adminApi";

interface Deposit {
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

export default function DepositActivity() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const data = await getDepositActivities(1, 50);
      const depositsList = data.data || data || [];
      setDeposits(Array.isArray(depositsList) ? depositsList : []);
      setError("");
    } catch (err: any) {
      console.error("Error fetching deposits:", err);
      setError(err.message || "Failed to load deposits");
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeposit = async (deprecitId: string) => {
    setActionLoading(deprecitId);
    try {
      await approveDeposit(deprecitId);
      setDeposits(
        deposits.map((deposit) =>
          deposit._id === deprecitId ? { ...deposit, status: "completed" } : deposit
        )
      );
      alert("Deposit approved!");
    } catch (err: any) {
      alert("Failed to approve: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectDeposit = async (depositId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    
    setActionLoading(depositId);
    try {
      await rejectDeposit(depositId, reason);
      setDeposits(
        deposits.map((deposit) =>
          deposit._id === depositId ? { ...deposit, status: "rejected" } : deposit
        )
      );
      alert("Deposit rejected!");
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
      {loading && deposits.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <Loader className="inline-block animate-spin mr-2" size={20} />
          Loading deposits...
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
            {deposits.length > 0 ? (
              deposits.map((deposit) => (
                <tr key={deposit._id} className="border-t cursor-pointer border-white/5 hover:bg-white/5">
                  <td className="px-3 py-4">
                    <input type="checkbox" />
                  </td>

                  <td className="px-3 py-4">{deposit.tx || deposit.txHash || deposit._id.substring(0, 10)}</td>
                  <td className="px-3 py-4">{deposit.recipient || deposit.userId?.name || "Unknown"}</td>
                  <td className="px-3 py-4">{deposit.email || deposit.userId?.email || "N/A"}</td>

                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      {deposit.assets ? (
                        deposit.assets.map((asset: string) => (
                          <div key={asset} className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center text-xs">
                              {asset.substring(0, 1)}
                            </div>
                            <span className="text-gray-300 text-xs">{asset}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs">{deposit.asset || "Unknown"}</span>
                      )}
                    </div>
                  </td>

                  <td className="px-3 py-4 text-white">{deposit.amount}</td>
                  <td className="px-3 py-4 text-gray-400">
                    {deposit.time || new Date(deposit.createdAt!).toLocaleDateString()}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={`rounded-lg px-3 py-1 text-xs text-white ${
                        deposit.status.toLowerCase() === "completed" || deposit.status.toLowerCase() === "successful"
                          ? "bg-[#4DCFA6]"
                          : deposit.status.toLowerCase() === "pending"
                            ? "bg-[#FF8D28]"
                            : "bg-red-500"
                      }`}
                    >
                      {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-3 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      {deposit.status.toLowerCase() === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveDeposit(deposit._id)}
                            disabled={actionLoading === deposit._id}
                            className="rounded-md bg-green-500/20 p-2 hover:bg-green-500/40 text-green-400 disabled:opacity-50"
                          >
                            {actionLoading === deposit._id ? (
                              <Loader size={16} className="animate-spin" />
                            ) : (
                              <Check size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => handleRejectDeposit(deposit._id)}
                            disabled={actionLoading === deposit._id}
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
                  No deposits found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
