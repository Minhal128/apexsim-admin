"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Loader, Check, X } from "lucide-react";
import Image from "next/image";
import { getDepositActivities, approveDeposit, rejectDeposit } from "@/lib/adminApi";

export default function DepositHistory() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApproveDeposit = async (depositId: string) => {
    setActionLoading(depositId);
    try {
      await approveDeposit(depositId);
      setDeposits(
        deposits.map((deposit) =>
          deposit._id === depositId || deposit.depositId === depositId ? { ...deposit, status: "completed" } : deposit
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
          deposit._id === depositId || deposit.depositId === depositId ? { ...deposit, status: "rejected" } : deposit
        )
      );
      alert("Deposit rejected!");
    } catch (err: any) {
      alert("Failed to reject: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        setLoading(true);
        const response = await getDepositActivities(1, 50);
        const depositsList = response.deposits || response.data || response || [];
        setDeposits(Array.isArray(depositsList) ? depositsList : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch deposits:', err);
        setDeposits([]);
        setError('Failed to fetch deposits');
      } finally {
        setLoading(false);
      }
    };
    fetchDeposits();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading deposits...</div>
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
            <th className="px-3 py-3">Deposit ID</th>
            <th className="px-3 py-3">User ID</th>
            <th className="px-3 py-3">Asset</th>
            <th className="px-3 py-3">Amount</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Date</th>
            <th className="px-3 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="text-gray-300">
          {deposits.length === 0 && (
            <tr>
              <td colSpan={7} className="px-3 py-4 text-center text-gray-400">
                No deposits found
              </td>
            </tr>
          )}
          {deposits.map((item, index) => {
            const asset = item.assetType || 'BTC';
            return (
            <tr
              key={index}
              className="border-t cursor-pointer font-Manrope border-white/5 hover:bg-white/5"
            >
              <td className="px-3 py-4 text-xs">{item._id || item.depositId || 'N/A'}</td>
              <td className="px-3 py-4 text-xs">{item.userId?.name || item.userId || 'N/A'}</td>

              {/* Asset column */}
              <td className="px-3 py-4">
                <div className="flex items-center gap-1">
                  <Image
                    src={assetIcons[asset] || assetIcons['BTC']}
                    alt={asset}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="text-gray-300 text-xs font-Manrope">
                    {asset}
                  </span>
                </div>
              </td>

              <td className="px-3 py-4 text-white font-Manrope">
                {item.amount || 'N/A'}
              </td>

              {/* Status Badge */}
              <td className="px-3 py-4">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-Manrope text-white ${
                    item.status === 'approved' || item.status === 'Approved'
                      ? "bg-[#00B595]"
                      : item.status === 'pending' || item.status === 'Pending'
                      ? "bg-[#FF8D28]"
                      : "bg-[#FF383C]"
                  }`}
                >
                  {item.status || 'Pending'}
                </span>
              </td>

              <td className="px-3 py-4 font-Manrope text-gray-400 text-xs">
                {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
              </td>

              <td className="px-3 py-4 text-right">
                <div className="flex gap-2 justify-end">
                  {(item.status === 'pending' || item.status === 'Pending') && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleApproveDeposit(item._id || item.depositId); }}
                        disabled={actionLoading === (item._id || item.depositId)}
                        className="rounded-md bg-green-500/20 p-2 hover:bg-green-500/40 text-green-400 disabled:opacity-50"
                      >
                        {actionLoading === (item._id || item.depositId) ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRejectDeposit(item._id || item.depositId); }}
                        disabled={actionLoading === (item._id || item.depositId)}
                        className="rounded-md bg-red-500/20 p-2 hover:bg-red-500/40 text-red-400 disabled:opacity-50"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                  <button className="rounded-md font-Manrope bg-white/5 p-2 hover:bg-white/10">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
