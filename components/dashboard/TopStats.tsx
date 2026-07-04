"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { apiRequest } from "@/lib/api";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TopStats() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiRequest("/admin/stats");
        setStats([
          {
            title: "Total Users",
            value: data.totalUsers.toLocaleString(),
            color: "#F59E0B",
            data: [10, 15, 12, 18, 16, 22, 25],
          },
          {
            title: "24h Deposit",
            value: `$${data.dailyDeposit.toLocaleString()}`,
            color: "#22C55E",
            data: [20, 18, 25, 22, 30, 28, 35],
          },
          {
            title: "24h Withdrawal",
            value: `$${data.dailyWithdrawal.toLocaleString()}`,
            color: "#F59E0B",
            data: [30, 25, 28, 26, 32, 30, 38],
          },
          {
            title: "24h Volume",
            value: `$${data.dailyVolume.toLocaleString()}`,
            color: "#EF4444",
            data: [40, 38, 35, 32, 30, 28, 25],
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-xl bg-[#0E0D15] px-5 py-8"
        >
          <div>
            <p className="text-xs font-Manrope text-[#828A92]">{item.title}</p>
            <h3 className="mt-1 text-2xl font-Manrope text-white">
              {item.value}
            </h3>
          </div>

          <div className="w-20">
            <Chart
              options={{
                chart: {
                  type: "line",
                  sparkline: { enabled: true },
                },
                stroke: {
                  curve: "smooth",
                  width: 2,
                },
                colors: [item.color],
                tooltip: {
                  enabled: false,
                },
              }}
              series={[
                {
                  data: item.data,
                },
              ]}
              type="line"
              height={40}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
