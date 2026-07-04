"use client";

import { Search, Filter, Upload, MoreHorizontal } from "lucide-react";

export default function RecenteActivities() {
  const users = [
    {
      id: "0x5f...a92x68",
      recipient: "Bessie Cooper",
      email: "kenzi.lawson@example.com",
      status: "Successful",
    },
    {
      id: "0x5f...a92x68",
      recipient: "Annette Black",
      email: "sara.cruz@example.com",
      status: "Successful",
    },
    {
      id: "0x5f...a92x68",
      recipient: "Jacob Jones",
      email: "willie.jennings@example.com",
      status: "Successful",
    },
  ];

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
                <th className="px-3 py-3 text-left">Recipient</th>
                <th className="px-3 py-3 text-left">Email Address</th>
                <th className="px-3 py-3 text-left">Status</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-300">
              {users.map((user, index) => (
                <tr
                  key={index}
                  className="border-t border-white/5 hover:bg-white/5"
                >
                  <td className="px-3 py-4">
                    <input type="checkbox" />
                  </td>
                  <td className="px-3 py-4 text-white">{user.id}</td>
                  <td className="px-3 py-4">{user.recipient}</td>
                  <td className="px-3 py-4 text-gray-400">{user.email}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#4DCFA6]" />
                      <span className="text-xs">{user.status}</span>
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
