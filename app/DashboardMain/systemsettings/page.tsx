"use client";

import SettingsTabs from "@/components/Settings/SettingsTabs";
import { useState } from "react";

export default function SystemSettingsPage() {
  return (
    <div className="w-full space-y-6 text-white">
      <h1 className="text-2xl font-Manrope">System Settings</h1>

      {/* Tabs Component */}
      <SettingsTabs />
    </div>
  );
}
