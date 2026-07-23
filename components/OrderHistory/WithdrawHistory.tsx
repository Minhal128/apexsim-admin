"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { getWithdrawActivities } from "@/lib/adminApi";

export default function WithdrawHistory() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setLoading(true);
        const response = await getWithdrawActivities(1, 50);
        const withdrawalsList = response.withdrawals || response.data || response || [];
        setWithdrawals(Array.isArray(withdrawalsList) ? withdrawalsList : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch withdrawals:', err);
        setWithdrawals([]);
        setError('Failed to fetch withdrawals');
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawals();
  }, []);



  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-400">Loading withdrawals...</div>
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
          <tr className="text-left text-xs bg-[#17161E] text-gray-400">
            <th className="px-3 py-3">Withdrawal ID</th>
            <th className="px-3 py-3">User ID</th>
            <th className="px-3 py-3">Asset</th>
            <th className="px-3 py-3">Amount</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Requested At</th>
            <th className="px-3 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="text-gray-300">
          {withdrawals.length === 0 && (
            <tr>
              <td colSpan={7} className="px-3 py-4 text-center text-gray-400">
                No withdrawals found
              </td>
            </tr>
          )}
          {withdrawals.map((item, index) => {
            const asset = item.assetType || 'BTC';
            return (
            <tr
              key={index}
              className="border-t border-white/5 hover:bg-white/5 cursor-pointer"
            >
              <td className="px-3 py-4 text-xs">{item._id || item.withdrawalId || 'N/A'}</td>
              <td className="px-3 py-4 text-xs">{item.userId?.name || item.userId || 'N/A'}</td>

              {/* Asset */}
              <td className="px-3 py-4">
                <div className="flex items-center gap-1">
                  <Image
                    src={assetIcons[asset] || assetIcons['BTC']}
                    alt={asset}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="text-xs">{asset}</span>
                </div>
              </td>

              {/* Amount */}
              <td className="px-3 py-4 text-white text-xs">{item.amount || 'N/A'}</td>

              {/* Status */}
              <td className="px-3 py-4">
                <span
                  className={`px-3 py-1 rounded-md text-xs text-white font-Manrope ${
                    item.status === 'approved' || item.status === 'Approved' ? "bg-[#00B595]" : item.status === 'pending' || item.status === 'Pending' ? "bg-[#FF8D28]" : "bg-[#FF383C]"
                  }`}
                >
                  {item.status || 'Pending'}
                </span>
              </td>

              {/* Requested At */}
              <td className="px-3 py-4 text-gray-400 text-xs">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</td>

              {/* Actions */}
              <td className="px-3 py-4 text-right">
                <button className="rounded-md bg-white/5 p-2 hover:bg-white/10">
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
