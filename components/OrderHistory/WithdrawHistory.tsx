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
        if (response?.data) {
          setWithdrawals(response.data);
        } else {
          setWithdrawals(mockWithdrawals);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch withdrawals:', err);
        setWithdrawals(mockWithdrawals);
        setError('Using demo data');
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawals();
  }, []);

  const mockWithdrawals = [
    {
      withdrawalId: "0x5f...a92x68",
      userId: "Tanya Hill",
      assets: ["BTC"],
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      amount: "0.0383 BTC",
      status: "Approved",
      requestedAt: "2/11/12 09:16AM",
      processedAt: "2/11/12 09:30AM",
    },
    {
      withdrawalId: "0x3a...b71x34",
      userId: "James Smith",
      assets: ["ETH"],
      address: "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
      amount: "1.234 ETH",
      status: "Pending",
      requestedAt: "3/12/12 10:45AM",
      processedAt: "--",
    },
    {
      withdrawalId: "0x7b...c12x55",
      userId: "Olivia Brown",
      assets: ["USDT"],
      address: "TNJ7H7JkNwqRz6d8Nq6v1Sx3p8bE1",
      amount: "500 USDT",
      status: "Approved",
      requestedAt: "4/01/23 11:20AM",
      processedAt: "4/01/23 11:35AM",
    },
    {
      withdrawalId: "0x5f...a92x68",
      userId: "Tanya Hill",
      assets: ["BTC"],
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      amount: "0.0383 BTC",
      status: "Approved",
      requestedAt: "2/11/12 09:16AM",
      processedAt: "2/11/12 09:30AM",
    },
    {
      withdrawalId: "0x3a...b71x34",
      userId: "James Smith",
      assets: ["ETH"],
      address: "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
      amount: "1.234 ETH",
      status: "Pending",
      requestedAt: "3/12/12 10:45AM",
      processedAt: "--",
    },
    {
      withdrawalId: "0x7b...c12x55",
      userId: "Olivia Brown",
      assets: ["USDT"],
      address: "TNJ7H7JkNwqRz6d8Nq6v1Sx3p8bE1",
      amount: "500 USDT",
      status: "Approved",
      requestedAt: "4/01/23 11:20AM",
      processedAt: "4/01/23 11:35AM",
    },
  ];

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
          {withdrawals.map((item, index) => {
            const asset = item.assetType || 'BTC';
            return (
            <tr
              key={index}
              className="border-t border-white/5 hover:bg-white/5 cursor-pointer"
            >
              <td className="px-3 py-4 text-xs">{item._id || item.withdrawalId || 'N/A'}</td>
              <td className="px-3 py-4 text-xs">{item.userId || 'N/A'}</td>

              {/* Asset */}
              <td className="px-3 py-4">
                <div className="flex items-center gap-1">
                  <Image
                    src={assetIcons[asset]}
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
