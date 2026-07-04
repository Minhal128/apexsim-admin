"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { getDepositActivities } from "@/lib/adminApi";

export default function DepositHistory() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        setLoading(true);
        const response = await getDepositActivities(1, 50);
        if (response?.data) {
          setDeposits(response.data);
        } else {
          setDeposits(mockDeposits);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch deposits:', err);
        setDeposits(mockDeposits);
        setError('Using demo data');
      } finally {
        setLoading(false);
      }
    };
    fetchDeposits();
  }, []);

  const mockDeposits = [
    {
      tradeId: "0x5f...a92x68",
      userId: "Tanya Hill",
      pair: ["BTC"],
      type: "Limit",
      side: "Long",
      price: "0.0383 BTC",
      quantity: "0.39393",
      pnl: "+0.2%",
      pnlUp: true,
      executedAt: "2/11/12 09:16AM",
    },
    {
      tradeId: "0x3a...b71x34",
      userId: "James Smith",
      pair: ["ETH"],
      type: "Market",
      side: "Short",
      price: "1.234 ETH",
      quantity: "1.2",
      pnl: "-0.2%",
      pnlUp: false,
      executedAt: "3/12/12 10:45AM",
    },
    {
      tradeId: "0x7b...c12x55",
      userId: "Olivia Brown",
      pair: ["USDT"],
      type: "Limit",
      side: "Long",
      price: "500 USDT",
      quantity: "10",
      pnl: "+0.5%",
      pnlUp: true,
      executedAt: "4/01/23 11:20AM",
    },
    {
      tradeId: "0x5f...a92x68",
      userId: "Tanya Hill",
      pair: ["BTC"],
      type: "Limit",
      side: "Long",
      price: "0.0383 BTC",
      quantity: "0.39393",
      pnl: "+0.2%",
      pnlUp: true,
      executedAt: "2/11/12 09:16AM",
    },
    {
      tradeId: "0x3a...b71x34",
      userId: "James Smith",
      pair: ["ETH"],
      type: "Market",
      side: "Short",
      price: "1.234 ETH",
      quantity: "1.2",
      pnl: "-0.2%",
      pnlUp: false,
      executedAt: "3/12/12 10:45AM",
    },
    {
      tradeId: "0x7b...c12x55",
      userId: "Olivia Brown",
      pair: ["USDT"],
      type: "Limit",
      side: "Long",
      price: "500 USDT",
      quantity: "10",
      pnl: "+0.5%",
      pnlUp: true,
      executedAt: "4/01/23 11:20AM",
    },
  ];

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
          {deposits.map((deposit, index) => {
            const asset = deposit.assetType || 'BTC';
            return (
            <tr
              key={index}
              className="border-t cursor-pointer font-Manrope border-white/5 hover:bg-white/5"
            >
              <td className="px-3 py-4 font-Manrope text-xs">{deposit._id || deposit.depositId || 'N/A'}</td>
              <td className="px-3 py-4 font-Manrope text-xs">{deposit.userId || 'N/A'}</td>

              {/* Asset column */}
              <td className="px-3 py-4">
                <div className="flex items-center gap-1">
                  <Image
                    src={assetIcons[asset]}
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
                {deposit.amount || 'N/A'}
              </td>

              {/* Status Badge */}
              <td className="px-3 py-4">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-Manrope text-white ${
                    deposit.status === 'approved' || deposit.status === 'Approved'
                      ? "bg-[#00B595]"
                      : deposit.status === 'pending' || deposit.status === 'Pending'
                      ? "bg-[#FF8D28]"
                      : "bg-[#FF383C]"
                  }`}
                >
                  {deposit.status || 'Pending'}
                </span>
              </td>

              <td className="px-3 py-4 font-Manrope text-gray-400 text-xs">
                {deposit.createdAt ? new Date(deposit.createdAt).toLocaleString() : 'N/A'}
              </td>

              <td className="px-3 py-4 text-right">
                <button className="rounded-md font-Manrope bg-white/5 p-2 hover:bg-white/10">
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
