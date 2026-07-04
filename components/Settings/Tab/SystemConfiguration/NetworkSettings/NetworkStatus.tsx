"use client";

import { useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

interface Props {
  onBack: () => void;
}

type RPCOption = {
  code: string;
  label: string;
};

const rpcOptions: RPCOption[] = [
  { code: "online", label: "Online" },
  { code: "offline", label: "Offline" },
  { code: "undermaintenance", label: "Under maintenance" },
];

export default function NetworkStatus({ onBack }: Props) {
  const [selected, setSelected] = useState<string>("online");

  return (
    <div className="w-full">
      {/* BACK */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 cursor-pointer text-sm mb-6 text-white"
      >
        <IoIosArrowBack size={20} />
      </button>

      {/* OPTIONS LIST */}
      <div className="space-y-1">
        {rpcOptions.map((option) => {
          const isActive = selected === option.code;

          return (
            <div
              key={option.code}
              onClick={() => setSelected(option.code)}
              className="flex items-center font-Manrope justify-between py-3 cursor-pointer transition"
            >
              {/* LEFT TEXT */}
              <p className="text-sm font-Manrope">{option.label}</p>

              {/* RIGHT ICON */}
              <IoCheckmarkCircle
                className={`text-xl transition ${
                  isActive ? "text-[#0055FF]" : "text-[#2F2F34]"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

