"use client";

import { useState } from "react";
import { RiSettings6Line } from "react-icons/ri";

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
      enabled ? "bg-[#0055FF]" : "bg-gray-600"
    }`}
  >
    <div
      className={`bg-white w-3 h-3 rounded-full shadow-md transform transition ${
        enabled ? "translate-x-3" : "translate-x-0"
      }`}
    />
  </div>
);

const SettingItem = ({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
    <div className="space-y-1">
      <p className="font-Manrope text-sm">{title}</p>
      <span className="text-xs font-Manrope text-gray-400 leading-relaxed">
        {description}
      </span>
    </div>

    {/* Toggle aligned properly on mobile */}
    <div className="self-end sm:self-auto">
      <Toggle enabled={enabled} onChange={onToggle} />
    </div>
  </div>
);

export default function NotificationSettings() {
  const [transaction, setTransaction] = useState(true);
  const [price, setPrice] = useState(false);
  const [security, setSecurity] = useState(true);
  const [system, setSystem] = useState(true);

  return (
    <div className="w-full min-h-screen bg-[#0E0D15] text-white p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <RiSettings6Line className="text-lg" />
          <h2 className="text-sm font-Manrope">
            Notifications Settings
          </h2>
        </div>

        {/* Settings Card */}
        <div className="bg-[#12111A] rounded-xl divide-y divide-[#1F1E2A]">
          <SettingItem
            title="Transaction Alert"
            description="Get notified instantly when a user sends, receives, or swaps crypto assets"
            enabled={transaction}
            onToggle={() => setTransaction(!transaction)}
          />

          <SettingItem
            title="Price Alert"
            description="Receive alerts when token prices rise or fall beyond your set thresholds"
            enabled={price}
            onToggle={() => setPrice(!price)}
          />

          <SettingItem
            title="Security Alert"
            description="Stay informed about suspicious activity, failed login attempts"
            enabled={security}
            onToggle={() => setSecurity(!security)}
          />

          <SettingItem
            title="System Update"
            description="Get notified about LEGERIUM version updates and maintenance schedules"
            enabled={system}
            onToggle={() => setSystem(!system)}
          />
        </div>
      </div>
    </div>
  );
}
