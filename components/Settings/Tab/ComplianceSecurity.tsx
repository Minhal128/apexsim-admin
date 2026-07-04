"use client";

import { useState } from "react";
import { RiSettings6Line } from "react-icons/ri";
import { IoChevronDown } from "react-icons/io5";

const Toggle = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) => (
  <div
    onClick={onChange}
    className={`w-8 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${
      enabled ? "bg-[#00B595]" : "bg-gray-600"
    }`}
  >
    <div
      className={`bg-white w-3 h-3 rounded-full shadow-md transform transition ${
        enabled ? "translate-x-3" : "translate-x-0"
      }`}
    />
  </div>
);

const AMLDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const options = [
    "Flags amount above $1000",
    "Flags amount above $3000",
    "Flags amount above $5000",
    "Flags amount above $10000",
  ];

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center cursor-pointer justify-between rounded-lg border border-[#2B3343] px-4 h-11 text-sm text-gray-200"
      >
        {value}
        <IoChevronDown className="text-gray-400" />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-lg border border-[#2B3343] bg-[#12111A] shadow-lg">
          {options.map((item) => (
            <div
              key={item}
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#2B3343] ${
                value === item ? "text-[#0055FF]" : "text-gray-200"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ComplianceSecurity() {
  const [amlValue, setAmlValue] = useState("Flags amount above $5000");
  const [dailyLimit, setDailyLimit] = useState("$10");
  const [twoFA, setTwoFA] = useState(true);

  return (
    <div className="w-full min-h-screen bg-[#0E0D15] text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <RiSettings6Line className="text-lg" />
          <h2 className="text-sm font-Manrope">Compliance & Security</h2>
        </div>

        {/* Card */}
        <div className="bg-[#12111A] rounded-xl p-5 space-y-6">
          <div>
            <h3 className="text-sm font-Manrope mb-4">AML Thresholds</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-Manrope text-gray-400">
                  Transaction monitoring
                </p>
                <AMLDropdown value={amlValue} onChange={setAmlValue} />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-Manrope text-gray-400">
                  Daily transaction limit
                </p>
                <input
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                  className="w-full h-11 rounded-lg border border-[#2B3343] px-4 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-[#1F1E2A]" />

          {/* Two Factor Authentication */}
          <div className="space-y-2">
            <p className="text-sm font-Manrope">Two-Factor Authentication</p>

            <div className="flex items-center gap-3">
              <Toggle enabled={twoFA} onChange={() => setTwoFA(!twoFA)} />
              <span className="text-sm font-Manrope text-white">
                Require 2FA for withdrawal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
