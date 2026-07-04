"use client";

import { IoChevronForwardOutline } from "react-icons/io5";

interface Props {
  activeSection: string;
  setActiveSection: (value: any) => void;
  walletCreation: boolean;
  setWalletCreation: (value: boolean) => void;
}

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

export default function SystemConfigurationSidebar({
  activeSection,
  setActiveSection,
  walletCreation,
  setWalletCreation,
}: Props) {
  const itemClass = (key?: string) =>
    `flex justify-between items-center p-4 rounded-lg cursor-pointer transition
     `;

  return (
    <div className="bg-[#12111A] md:h-screen rounded-xl py-1">
      {/* Network Settings */}
      <div
        className={itemClass("network")}
        onClick={() => setActiveSection("network")}
      >
        <div>
          <p className="font-Manrope text-sm">Network Settings</p>
          <span className="text-xs font-Manrope text-gray-400">
            Manage supported blockchain networks
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-xs font-Manrope">RPC provider</span>
          <IoChevronForwardOutline />
        </div>
      </div>

      {/* Data Refresh */}
      <div
        className={itemClass("refresh")}
        onClick={() => setActiveSection("refresh")}
      >
        <div>
          <p className="font-Manrope text-sm">Data refresh interval</p>
          <span className="text-xs font-Manrope text-gray-400">Select refresh duration</span>
        </div>
        <div className="flex items-center font-Manrope gap-2 text-gray-400">
          <span className="text-xs font-Manrope">30 mins</span>
          <IoChevronForwardOutline />
        </div>
      </div>

      {/* Transaction Fee */}
      <div className={itemClass("fee")} onClick={() => setActiveSection("fee")}>
        <div>
          <p className="font-Manrope text-sm">Transaction fee</p>
          <span className="text-xs font-Manrope text-gray-400">Configure fee limits</span>
        </div>
        <IoChevronForwardOutline className="text-gray-400 font-Manrope" />
      </div>

      {/* Transaction Limit */}
      <div
        className={itemClass("limit")}
        onClick={() => setActiveSection("limit")}
      >
        <div>
          <p className="font-Manrope text-sm">Transaction limit</p>
          <span className="text-xs font-Manrope text-gray-400">Set transfer limits</span>
        </div>
        <IoChevronForwardOutline className="text-gray-400" />
      </div>

      {/* User Wallet Creation (Toggle) */}
      <div className="flex justify-between items-center p-4">
        <div>
          <p className="font-Manrope text-sm">User wallet creation</p>
          <span className="text-xs font-Manrope text-gray-400">
            Allow users to create wallets
          </span>
        </div>

        <Toggle
          enabled={walletCreation}
          onChange={() => setWalletCreation(!walletCreation)}
        />
      </div>
    </div>
  );
}
