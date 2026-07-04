"use client";

import { useState } from "react";
import { Search, Filter, Upload, MoreHorizontal } from "lucide-react";
import OverviewActivity from "./OverviewActivity";
import DepositActivity from "./DepositActivity";
import WithdrawActivity from "./WithdrawActivity";

export default function ActiveTabs() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "deposit" | "withdraw"
  >("overview");

  return (
    <div className="w-full rounded-2xl bg-[#0E0D15] border border-[#0E0D15] p-2 sm:p-3">
      <div className="mb-4 flex flex-col bg-[#17161E] gap-4 rounded-md p-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-Manrope text-white">
          Active Wallet <span className="text-gray-400 font-Manrope">(100,936)</span>
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
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

          {/* Filter */}
          <button className="flex h-9 font-Manrope items-center gap-2 rounded-md bg-[#212027] px-3 text-sm text-gray-300 ring-1 ring-white/10 hover:bg-[#1F2937]">
            <Filter size={14} />
            Filter
          </button>

          {/* Export */}
          <button className="flex h-9 font-Manrope items-center gap-2 rounded-md bg-[#212027] px-3 text-sm text-gray-300 ring-1 ring-white/10 hover:bg-[#1F2937]">
            <Upload size={14} />
            Export
          </button>

          <button className="flex h-9 w-9 font-Manrope items-center justify-center rounded-md bg-[#212027] text-gray-300 ring-1 ring-white/10 hover:bg-[#1F2937]">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-6 border-b font-Manrope border-white/10 px-0 mb-4">
        {["overview", "deposit", "withdraw"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-1 font-Manrope cursor-pointer text-sm capitalize ${
              activeTab === tab
                ? "text-white border-b-2 border-[#00B595]"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewActivity />}
      {activeTab === "deposit" && <DepositActivity />}
      {activeTab === "withdraw" && <WithdrawActivity />}
    </div>
  );
}
