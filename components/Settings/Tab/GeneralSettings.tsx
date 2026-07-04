"use client";

import { useState } from "react";
import { RiSettings6Line } from "react-icons/ri";

import SettingsSidebar from "./GeneraalSettings/SettingsSidebar";
import DefaultCurrency from "./GeneraalSettings/DefaultCurrency";
import DefaultLanguage from "./GeneraalSettings/DefaultLanguage";
import DateTimeFormat from "./GeneraalSettings/DateTimeFormat";

type SectionType = "currency" | "language" | "datetime";

export default function GeneralSettings() {
  const [activeSection, setActiveSection] = useState<SectionType>("currency");

  return (
    <div className="w-full min-h-screen bg-[#0E0D15] text-white p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* TOP LEFT TITLE WITH ICON */}
        <div className="flex items-center gap-2">
          <RiSettings6Line className="text-white text-lg" />
          <h2 className="text-sm font-Manrope text-white">General Settings</h2>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT SIDEBAR – 50% */}
          <div className="w-full md:w-1/2">
            <SettingsSidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>

          {/* RIGHT PANEL – 50% */}
          <div className="w-full md:w-1/2 bg-[#12111A] rounded-xl p-4">
            {activeSection === "currency" && <DefaultCurrency />}
            {activeSection === "language" && <DefaultLanguage />}
            {activeSection === "datetime" && <DateTimeFormat />}
          </div>
        </div>
      </div>
    </div>
  );
}
