"use client";

import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";

interface Network {
  id: string;
  name: string;
  icon: string;
  status: "Healthy" | "Warning" | "Critical";
}

interface Props {
  onBack: () => void;
}

const networks: Network[] = [
  { id: "btc", name: "BTC", icon: "/assets/bit.png", status: "Warning" },
  { id: "eth", name: "ETH", icon: "/assets/eth.png", status: "Healthy" },
  { id: "sol", name: "SOL", icon: "/assets/sol.png", status: "Warning" },
  { id: "avax", name: "AVAX", icon: "/assets/av.png", status: "Critical" },
];

const statusColors: Record<Network["status"], string> = {
  Healthy: "bg-[#34C759]",
  Warning: "bg-[#FF8D28]",
  Critical: "bg-[#FF383C]",
};

export default function NetworkHealth({ onBack }: Props) {
  return (
    <div className="mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center cursor-pointer gap-2 text-sm text-gray-300 mb-6 hover:text-white"
      >
        <IoIosArrowBack size={20} />
      </button>

      {/* Header */}
      <h2 className="text-lg font-Manrope text-white">RPC Provider</h2>
      <p className="text-gray-400 font-Manrope mt-1 mb-6 text-sm md:pr-40">
        Example: Green (Healthy), Yellow (Warning), Red (Critical issues).
      </p>

      {/* Network List */}
      <div className="space-y-2">
        {networks.map((network) => (
          <div
            key={network.id}
            className="flex items-center font-Manrope justify-between py-3 cursor-pointer transition-colors"
          >
            {/* Left: Icon + Name */}
            <div className="flex items-center gap-3">
              <Image
                src={network.icon}
                alt={network.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-white font-Manrope">{network.name}</span>
            </div>

            {/* Right: Status Bar + Text */}
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 rounded-full bg-gray-700 overflow-hidden">
                <div
                  className={`${statusColors[network.status]} font-Manrope h-2 rounded-full`}
                  style={{
                    width:
                      network.status === "Healthy"
                        ? "100%"
                        : network.status === "Warning"
                          ? "60%"
                          : "20%",
                  }}
                ></div>
              </div>
              <span className="text-sm font-Manrope text-gray-300">
                {network.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
