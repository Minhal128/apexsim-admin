"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { apiRequest } from "@/lib/api";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ActivityTrendChartProps {
  currentValue?: number;
  percentageChange?: number;
}

export default function TransactionChart({
  percentageChange = 4.9,
}: ActivityTrendChartProps) {
  const [month, setMonth] = useState("September");
  const [isOpen, setIsOpen] = useState(false);
  const [chartData, setChartData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [currentValue, setCurrentValue] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const data = await apiRequest("/admin/charts");
        
        const vols = data.data.map((d: any) => d.volume);
        setChartData(vols);
        
        const lbls = data.data.map((d: any) => {
           const dt = new Date(d.time);
           return `${dt.toLocaleString('default', { month: 'short' })}${dt.getDate()}`;
        });
        setLabels(lbls);
        
        setCurrentValue(vols[vols.length - 1] || 0);
      } catch (err) {
        console.error("Failed to fetch charts:", err);
      }
    };
    fetchCharts();
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      window.dispatchEvent(new Event("resize"));
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const months = ["September", "August", "July"];

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      width: "100%",
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0,
    },

    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "30%",
      },
    },

    dataLabels: { enabled: false },

    series: [
      {
        name: "Daily Activity",
        data: chartData.length > 0 ? chartData : [0],
      },
    ],

    xaxis: {
      categories: labels.length > 0 ? labels : [""],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#FFFFFF",
          fontSize: "12px",
        },
      },
    },

    yaxis: {
      labels: {
        formatter: (val: number) =>
          val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toString(),
        style: {
          colors: "#FFFFFF",
          fontSize: "11px",
        },
      },
      tickAmount: 5,
    },

    grid: { show: false },
    colors: ["#0055FF"],

    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: { columnWidth: "45%" },
          },
          xaxis: {
            labels: {
              rotate: -45,
              style: { fontSize: "10px" },
            },
          },
        },
      },
    ],
  };

  const getPercentageColor = (percentage: number) =>
    percentage >= 0 ? "text-green-500" : "text-red-500";

  return (
    <div
      ref={containerRef}
      className="bg-[#0E0D15] rounded-xl shadow-sm p-3 w-full border border-[#2B3343] overflow-hidden min-w-0"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6 relative">
        <h2 className="text-lg font-DMSans text-white">Activity Trend</h2>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 border bg-[#111116] border-[#434B5C] rounded-md px-3 py-1.5 text-sm text-white"
          >
            {month}
            <IoMdArrowDropdown size={16} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-full bg-[#202736] border border-[#434B5C] rounded-md overflow-hidden z-10">
              {months.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setMonth(item);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#2B3343] ${
                    month === item ? "bg-[#2B3343] text-blue-400" : "text-white"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#111116] rounded-lg p-4 overflow-hidden">
        <div className="mb-6">
          <span className="text-xl font-DMSans text-white">
            {currentValue.toLocaleString()}
          </span>

          <div
            className={`text-xs font-DMSans mt-1 ${getPercentageColor(
              percentageChange,
            )}`}
          >
            {percentageChange >= 0 ? "+" : ""}
            {percentageChange}% vs last quarter
          </div>
        </div>

        <div className="h-80 overflow-hidden">
          <Chart
            options={chartOptions}
            series={chartOptions.series}
            type="bar"
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
}
