"use client";

import { useState } from "react";
import GeneralSettings from "./Tab/GeneralSettings";
import SystemConfiguration from "./Tab/SystemConfiguration";
import NotificationSettings from "./Tab/NotificationSettings";
import ComplianceSecurity from "./Tab/ComplianceSecurity";
import Customization from "./Tab/Customization";

const tabs = [
  { id: "general", label: "General Settings" },
  { id: "system", label: "System Configuration" },
  { id: "notifications", label: "Notifications settings" },
  { id: "security", label: "Compliance & Security" },
  { id: "custom", label: "Customization" },
];

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      {/* TOP TABS */}
      <div className="flex gap-6 font-Manrope overflow-x-auto border-b border-white/10 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap cursor-pointer pb-2 text-sm font-medium border-b-2 transition
              ${
                activeTab === tab.id
                  ? "border-[#00B595] text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "general" && <GeneralSettings />}
      {activeTab === "system" && <SystemConfiguration />}
      {activeTab === "notifications" && <NotificationSettings />}
      {activeTab === "security" && <ComplianceSecurity />}
      {activeTab === "custom" && <Customization />}
    </div>
  );
}
