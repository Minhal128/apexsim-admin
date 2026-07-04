"use client";

import { useState } from "react";
import { RiSettings6Line } from "react-icons/ri";
import SystemConfigurationSidebar from "./SystemConfiguration/SystemConfigurationSidebar";
import NetworkSettings from "./SystemConfiguration/NetworkSettings";
import DataRefresh from "./SystemConfiguration/DataRefresh";
import TransactionFee from "./SystemConfiguration/TransactionFee";
import TransactionLimit from "./SystemConfiguration/TransactionLimit";

type SectionType = "network" | "refresh" | "fee" | "limit";

export default function SystemConfiguration() {
  const [activeSection, setActiveSection] = useState<SectionType>("network");
  const [walletCreation, setWalletCreation] = useState(true);

  return (
    <div className="w-full min-h-screen bg-[#0E0D15] text-white p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <RiSettings6Line className="text-lg" />
          <h2 className="text-sm font-Manrope">System Configuration</h2>
        </div>

        {/* Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/2">
            <SystemConfigurationSidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              walletCreation={walletCreation}
              setWalletCreation={setWalletCreation}
            />
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 bg-[#12111A] rounded-xl p-4">
            {activeSection === "network" && <NetworkSettings />}
            {activeSection === "refresh" && <DataRefresh/>}
            {activeSection === "fee" && <TransactionFee />}
            {activeSection === "limit" && <TransactionLimit />}
          </div>
        </div>
      </div>
    </div>
  );
}
