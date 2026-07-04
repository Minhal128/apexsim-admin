"use client";

import { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";

export default function TransactionLimit() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("Daily");

  const options = ["Daily", "Weekly", "Monthly"];

  return (
    <div className="space-y-3">
      {/* Title */}
      <div>
        <h3 className="text-sm mb-3 font-Manrope text-white">
          Transaction Limit
        </h3>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-Manrope">
            Daily/user
          </label>
          <input
            type="text"
            placeholder="$10"
            className="w-full border font-Manrope border-[#2F2F34] rounded-lg px-3 py-3 text-sm text-white outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-Manrope">
            Weekly/user
          </label>
          <input
            type="text"
            placeholder="$10"
            className="w-full border font-Manrope border-[#2F2F34] rounded-lg px-3 py-3 text-sm text-white outline-none"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-Manrope">
            Minimum Withdrawal
          </label>
          <input
            type="text"
            placeholder="$10"
            className="w-full border font-Manrope border-[#2F2F34] rounded-lg px-3 py-3 text-sm text-white outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-Manrope">
            Maximum withdrawal
          </label>
          <input
            type="text"
            placeholder="$10"
            className="w-full border font-Manrope border-[#2F2F34] rounded-lg px-3 py-3 text-sm text-white outline-none"
          />
        </div>
      </div>

      {/* Dropdown */}
      <div className="space-y-2 relative">
        <label className="text-xs text-gray-400 font-Manrope">
          Liquidity alert
        </label>

        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full border border-[#2F2F34] rounded-lg px-3 py-3 text-sm text-white font-Manrope cursor-pointer flex justify-between items-center"
        >
          <span>{selectedType}</span>
          <IoChevronDownOutline className="text-gray-400" />
        </div>

        {dropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-[#0E0D15] border border-[#2F2F34] rounded-lg overflow-hidden">
            {options.map((item) => (
              <div
                key={item}
                onClick={() => {
                  setSelectedType(item);
                  setDropdownOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer font-Manrope hover:bg-[#1A1924]
                ${
                  selectedType === item
                    ? "bg-[#1A1924] text-white"
                    : "text-gray-400"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Button */}
      <div className="pt-2">
        <button className="w-full mt-3 font-Manrope bg-blue-600 cursor-pointer transition rounded-lg py-3 text-sm">
          Save Changes
        </button>
      </div>
    </div>
  );
}
