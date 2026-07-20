"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter, Upload, MoreHorizontal } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function RecenteActivities({ userId }: { userId?: string }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await apiRequest(`/admin/wallet/transactions?userId=${userId}`);
        const data = res.transactions || res.data || res;
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch user transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [userId]);


  return (
    <div className="rounded-2xl bg-[#0E0D15] border border-white/5">
      <div className="overflow-x-auto">
        <div className="min-w-225 p-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-Manrope text-white">
              Recent Activities
            </h2>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="h-9 w-44 rounded-md bg-[#212027] pl-9 pr-3 text-sm text-white placeholder-gray-400 outline-none ring-1 ring-white/10"
                />
              </div>

              <button className="flex h-9 items-center gap-2 rounded-md bg-[#212027] px-3 text-sm text-gray-300 ring-1 ring-white/10">
                <Filter size={14} />
                Filter
              </button>

              <button className="flex h-9 items-center gap-2 rounded-md bg-[#212027] px-3 text-sm text-gray-300 ring-1 ring-white/10">
                <Upload size={14} />
                Export
              </button>

              <button className="flex h-9 w-9 items-center justify-center rounded-md bg-[#212027] text-gray-300 ring-1 ring-white/10">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          <table className="w-full text-sm font-Manrope">
            <thead>
              <tr className="bg-[#17161E] text-gray-400 text-xs">
                <th className="px-3 py-3">
                  <input type="checkbox" />
                </th>
                <th className="px-3 py-3 text-left">Transaction ID</th>
                <th className="px-3 py-3 text-left">Type</th>
                <th className="px-3 py-3 text-left">Amount</th>
                <th className="px-3 py-3 text-left">Status</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-300">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">No recent activities.</td></tr>
              ) : transactions.map((tx, index) => (
                <tr
                  key={index}
                  className="border-t border-white/5 hover:bg-white/5"
                >
                  <td className="px-3 py-4">
                    <input type="checkbox" />
                  </td>
                  <td className="px-3 py-4 text-white">
                    {tx._id.substring(0, 10)}...
                  </td>
                  <td className="px-3 py-4 capitalize">{tx.type}</td>
                  <td className="px-3 py-4 text-gray-400">
                    {tx.amount} {tx.asset}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${tx.status === 'completed' || tx.status === 'approved' ? 'bg-[#4DCFA6]' : tx.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      <span className="text-xs capitalize">{tx.status}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right">
                    <button className="rounded-md bg-white/5 p-2 hover:bg-white/10">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
