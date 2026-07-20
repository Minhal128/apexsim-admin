"use client";
import React, { useEffect, useState } from "react";
import { Search, Filter, Upload, MoreHorizontal } from "lucide-react";
import AddUserModal from "./AddUserModal";
import UserDetailsModal from "../Modal/UserDetailsModal";
import DepositModal from "../Modal/DepositModal";
import WithdrawModal from "../Modal/WithdrawModal";
import { apiRequest } from "@/lib/api";

export default function RecenteActivities() {
  const [openModal, setOpenModal] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiRequest("/admin/users");
        // Handle paginated response: { users: [], pagination: {} }
        const usersList = data.users || data;
        const mappedUsers = Array.isArray(usersList) ? usersList.map((user: any) => {
          const usdtBalance = user.wallet?.balances?.find((b: any) => b.asset === 'USDT')?.amount || 0;
          
          return {
            id: user._id.substring(0, 8),
            _id: user._id,
            name: user.firstName ? `${user.firstName} ${user.lastName || ""}` : "",
            email: user.email,
            kyc: user.kycStatus || "Verified",
            balance: `$${usdtBalance.toFixed(2)}`,
            joined: new Date(user.createdAt).toLocaleDateString(),
            status: "Successful",
            wallet: user.wallet,
          };
        }) : [];

        setUsers(mappedUsers);
        if (data.pagination) setTotalUsers(data.pagination.total);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);


  return (
    <>
      <div className="w-full rounded-2xl bg-[#0E0D15] border border-[#0E0D15] p-2 sm:p-3">
        {/* ================= Header ================= */}
        <div className="mb-4 flex flex-col gap-4 rounded-md p-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-Manrope text-white">
            Users <span className="text-gray-400 font-Manrope">({totalUsers.toLocaleString()})</span>
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search"
                className="h-9 w-40 rounded-md font-Manrope bg-[#212027] pl-9 pr-3 text-sm text-white placeholder-gray-400 outline-none ring-1 ring-white/10 focus:ring-white/20 sm:w-56"
              />
            </div>

            <button className="flex h-9 items-center gap-2 font-Manrope font-Manrope rounded-md bg-[#212027] px-3 text-sm text-gray-300 ring-1 ring-white/10 hover:bg-[#1F2937]">
              <Filter size={14} />
              Filter
            </button>

            <button className="flex h-9 items-center gap-2 font-Manrope rounded-md bg-[#212027] px-3 text-sm text-gray-300 ring-1 ring-white/10 hover:bg-[#1F2937]">
              <Upload size={14} />
              Export
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-md bg-[#212027] text-gray-300 ring-1 ring-white/10 hover:bg-[#1F2937]">
              <MoreHorizontal size={16} />
            </button>

            <button
              onClick={() => setOpenModal(true)}
              className="flex h-9 items-center cursor-pointer gap-2 font-Manrope rounded-md bg-[#0055FF] px-4 text-sm text-white"
            >
              Add New User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-DMSans">
            <thead>
              <tr className="text-left text-xs rounded-lg bg-[#17161E] text-gray-400">
                <th className="px-3 py-3 font-Manrope">User ID</th>
                <th className="px-3 py-3 font-Manrope">Email address</th>
                <th className="px-3 py-3 font-Manrope">KYC Status</th>
                <th className="px-3 py-3 font-Manrope">Balance</th>
                <th className="px-3 py-3 font-Manrope">Joined</th>
                <th className="px-3 py-3 font-Manrope">Status</th>
                <th className="px-3 py-3 text-right font-Manrope">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-300">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-4">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4">No users found.</td></tr>
              ) : users.map((user, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedUser(user)}
                  className="border-t border-white/5 cursor-pointer"
                >
                  <td className="px-3 py-4 font-Manrope">{user.id}</td>

                  <td className="px-3 py-4 truncate font-Manrope">
                    {user.email}
                  </td>

                  <td className="px-3 py-4 font-Manrope">
                    <span
                      className={`rounded-lg px-3 py-1 text-xs font-Manrope ${user.kyc === "Verified"
                        ? "bg-[#00B595] text-[#ffff]"
                        : "bg-[#FF8D28] text-[#ffff]"
                        }`}
                    >
                      {user.kyc}
                    </span>
                  </td>

                  <td className="px-3 py-4 font-Manrope text-white">
                    {user.balance}
                  </td>

                  <td className="px-3 py-4 text-gray-400 font-Manrope">
                    {user.joined}
                  </td>

                  <td className="px-3 py-4">
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-[#4DCFA6]" />
                      <span className="text-xs font-Manrope">
                        {user.status}
                      </span>
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

      {/* MODAL */}
      <AddUserModal open={openModal} onClose={() => setOpenModal(false)} />

      {/* USER DETAILS MODAL */}
      <UserDetailsModal
        open={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onDeposit={() => {
          setSelectedUser(null);
          setDepositModal(true);
        }}
        onWithdraw={() => {
          setSelectedUser(null);
          setWithdrawModal(true);
        }}
      />

      {/* DEPOSIT MODAL */}
      <DepositModal
        open={depositModal}
        onClose={() => setDepositModal(false)}
      />

      {/* WITHDRAW MODAL */}
      <WithdrawModal
        open={withdrawModal}
        onClose={() => setWithdrawModal(false)}
      />
    </>
  );
}
