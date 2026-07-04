"use client";

import Image from "next/image";
import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";

interface Props {
  market: {
    asset: string;
    icon: string;
  };
  onClose: () => void;
}

const feeds = [
  { name: "Binance", icon: "/assets/bi.png" },
  { name: "Bybit", icon: "/assets/by.png" },
];

const refreshIntervals = ["5 Secs", "10 Secs", "30 Secs"];
const deviations = ["1%", "2%", "5%", "10%"];

export default function MarketDetailModal({ market, onClose }: Props) {
  const [primaryFeed, setPrimaryFeed] = useState(feeds[0]);
  const [backupFeed, setBackupFeed] = useState(feeds[0]);
  const [refresh, setRefresh] = useState(refreshIntervals[1]);
  const [deviation, setDeviation] = useState(deviations[1]);
  const [open, setOpen] = useState<string | null>(null);

  const Dropdown = ({
    label,
    value,
    items,
    onSelect,
    id,
    withIcon = false,
  }: any) => (
    <div className="relative">
      <p className="mb-1 text-xs text-gray-400 font-Manrope">{label}</p>
      <button
        onClick={() => setOpen(open === id ? null : id)}
        className="flex w-full items-center justify-between cursor-pointer font-Manrope rounded-md border border-[#202026] bg-[#0A0A10] px-3 py-2 text-sm"
      >
        <div className="flex items-center font-Manrope gap-2">
          {withIcon && (
            <Image src={value.icon} alt={value.name} width={16} height={16} />
          )}
          <span className="font-Manrope">{withIcon ? value.name : value}</span>
        </div>
        <IoMdArrowDropdown size={16} />
      </button>

      {open === id && (
        <div className="absolute z-20 mt-2 w-full border border-[#202026] rounded-md bg-[#0A0A10]">
          {items.map((item: any) => (
            <div
              key={withIcon ? item.name : item}
              onClick={() => {
                onSelect(item);
                setOpen(null);
              }}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-white/10"
            >
              {withIcon && (
                <Image src={item.icon} alt={item.name} width={16} height={16} />
              )}
              <span>{withIcon ? item.name : item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl bg-[#0A0A10] p-5 text-white">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-Manrope">Market Details</h3>
          <button onClick={onClose}>
            <IoMdCloseCircle className="cursor-pointer" size={18} />
          </button>
        </div>

        {/* Asset */}
        <div className="mb-5 flex items-center gap-3">
          <Image src={market.icon} alt={market.asset} width={30} height={30} />
          <div>
            <p className="font-semibold">{market.asset}</p>
            <p className="text-sm text-blue-500 font-Manrope">$86,3547</p>
          </div>
        </div>

        {/* Price Feeds */}
        <div className="mb-4 rounded-lg border border-white/10 p-3">
          <p className="mb-3 text-sm font-Manrope">Price Feeds Settings</p>

          <div className="grid grid-cols-2 gap-3">
            <Dropdown
              label="Primary Feed"
              value={primaryFeed}
              items={feeds}
              onSelect={setPrimaryFeed}
              id="primary"
              withIcon
            />

            <Dropdown
              label="Backup Feed"
              value={backupFeed}
              items={feeds}
              onSelect={setBackupFeed}
              id="backup"
              withIcon
            />
          </div>

          <div className="mt-4">
            <Dropdown
              label="Price Refresh Interval"
              value={refresh}
              items={refreshIntervals}
              onSelect={setRefresh}
              id="refresh"
            />
          </div>

          <div className="mt-4">
            <Dropdown
              label="Deviation threshold (1%-100%)"
              value={deviation}
              items={deviations}
              onSelect={setDeviation}
              id="deviation"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 cursor-pointer font-Manrope rounded-md bg-[#0055FF] py-2 text-sm">
            Pause market
          </button>
          <button className="flex-1 font-Manrope cursor-pointer rounded-md bg-[#1F1F26] py-2 text-sm">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
