"use client";

import { useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";

type DateTimeOption = {
  code: string;
  label: string;
};

const dateTimeOptions: DateTimeOption[] = [
  { code: "12H", label: "12-Hour Format (e.g., 02:30 PM)" },
  { code: "24H", label: "24-Hour Format (e.g., 14:30)" },
  { code: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { code: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { code: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

export default function DataRefresh() {
  const [selected, setSelected] = useState<string>("12H");

  return (
    <div className="space-y-0 md:h-screen">
      {/* TITLE */}
      <h2 className="text-sm font-Manrope mb-4">Date & Time Format</h2>

      {/* LIST */}
      <div className="space-y-1">
        {dateTimeOptions.map((option) => {
          const isActive = selected === option.code;

          return (
            <div
              key={option.code}
              onClick={() => setSelected(option.code)}
              className="flex items-center justify-between py-3 px-0 rounded-lg cursor-pointer transition"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <p className="font-Manrope text-sm">{option.label}</p>
              </div>

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

      {/* SAVE BUTTON */}
      <button className="w-full mt-4 cursor-pointer font-Manrope bg-[#0055FF] transition text-white py-3 rounded-lg font-medium">
        Save
      </button>
    </div>
  );
}
