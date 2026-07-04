"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Loader } from "lucide-react";
import Image from "next/image";
import TransactionDetailModal, { UserType } from "./TransactionDetailModal";
import { getWalletTransactions } from "@/lib/adminApi";

interface TransactionType extends UserType {
  _id: string;
  txHash?: string;
  createdAt?: string;
  userId?: { name: string; email: string };
}

export default function OverviewActivity() {
  const [users, setUsers] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkedRows, setCheckedRows] = useState<boolean[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TransactionType | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getWalletTransactions(1, 50);
      const transactions = data.data || data || [];
      
      const transformedTransactions = Array.isArray(transactions)
        ? transactions.map((tx: any) => ({
            _id: tx._id || tx.id,
            tx: tx.tx || tx.txHash || tx._id?.substring(0, 10),
            txHash: tx.txHash,
            recipient: tx.recipient || tx.userId?.name || "Unknown",
            email: tx.email || tx.userId?.email || "N/A",
            assets: tx.assets || [tx.asset] || ["USDT"],
            amount: tx.amount || "0",
            time: tx.time || new Date(tx.createdAt).toLocaleDateString(),
            status: tx.status || "Pending",
            userId: tx.userId,
            createdAt: tx.createdAt,
          }))
        : [];

      setUsers(transformedTransactions);
      setCheckedRows(new Array(transformedTransactions.length).fill(false));
      setError("");
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "Failed to load transactions");
      // Fallback mock data
      setUsers([
        {
          _id: "1",
          tx: "0x5f...a92x68",
          recipient: "Tanya Hill",
          email: "tanya.hill@example.com",
          assets: ["BTC"],
          amount: "0.0564 BTC",
          time: "2/11/12",
          status: "Successful",
        },
        {
          _id: "2",
          tx: "0x3a...b71x34",
          recipient: "James Smith",
          email: "james.smith@example.com",
          assets: ["ETH"],
          amount: "1.234 ETH",
          time: "3/12/12",
          status: "Pending",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const assetIcons: Record<string, string> = {
    BTC: "/assets/bit.png",
    ETH: "/assets/eth.png",
    USDT: "/assets/t.png",
  };

  const handleRowClick = (index: number) => {
    const updated = [...checkedRows];
    updated[index] = !updated[index];
    setCheckedRows(updated);
    setSelectedUser(users[index]);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="relative overflow-x-auto">
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}
      {loading && users.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <Loader className="inline-block animate-spin mr-2" size={20} />
          Loading transactions...
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
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-t border-white/5 cursor-pointer hover:bg-white/5"
                  onClick={() => handleRowClick(index)}
                >
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={checkedRows[index] || false}
                      readOnly
                    />
                  </td>

                  <td className="px-3 py-4">{user.tx}</td>
                  <td className="px-3 py-4">{user.recipient}</td>
                  <td className="px-3 py-4">{user.email}</td>

                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      {user.assets.map((asset: string) => (
                        <div key={asset} className="flex items-center gap-1">
                          <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center text-xs font-bold">
                            {asset.substring(0, 1)}
                          </div>
                          <span className="text-gray-300 text-xs">{asset}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="px-3 py-4 text-white">{user.amount}</td>
                  <td className="px-3 py-4 text-gray-400">{user.time}</td>

                  <td className="px-3 py-4">
                    <span
                      className={`rounded-lg px-3 py-1 text-xs text-white ${
                        user.status === "Successful"
                          ? "bg-[#4DCFA6]"
                          : user.status === "Pending"
                            ? "bg-[#FF8D28]"
                            : "bg-red-500"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-3 py-4 text-right">
                    <button className="rounded-md bg-white/5 p-2 hover:bg-white/10">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-gray-400">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <TransactionDetailModal
        open={modalOpen}
        onClose={closeModal}
        user={selectedUser}
        assetIcons={assetIcons}
      />
    </div>
  );
}
