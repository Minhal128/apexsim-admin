"use client";

import { useState } from "react";
import Image from "next/image";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";

interface Props {
  open: boolean;
  onClose: () => void;
}

const coins = [
  { name: "USDT", image: "/assets/t.png" },
  { name: "Bitcoin", image: "/assets/bit.png" },
  { name: "Ethereum", image: "/assets/eth.png" },
];

const networks = ["EVM", "TRC20", "ERC20"];

export default function DepositModal({ open, onClose }: Props) {
  const [coinOpen, setCoinOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);

  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [selectedNetwork, setSelectedNetwork] = useState("EVM");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3">
      <div className="w-full max-w-lg rounded-2xl bg-[#0A0A10] p-6 text-white">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-Manrope">Deposit</h2>
          <button onClick={onClose}>
            <IoMdCloseCircle size={18} className="text-white cursor-pointer" />
          </button>
        </div>

        {/* Coin Dropdown */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-Manrope text-gray-400">Coin</p>
          <div className="relative">
            <button
              onClick={() => setCoinOpen(!coinOpen)}
              className="flex w-full items-center font-Manrope justify-between rounded-lg border border-[#202026] cursor-pointer px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={selectedCoin.image}
                  alt={selectedCoin.name}
                  width={22}
                  height={22}
                />
                <span className="font-Manrope text-sm">
                  {selectedCoin.name}
                </span>
              </div>
              <IoMdArrowDropdown size={18} />
            </button>

            {coinOpen && (
              <div className="absolute z-20 mt-2 w-full rounded-lg border border-[#202026] bg-[#0A0A10] shadow-lg">
                {coins.map((coin) => (
                  <button
                    key={coin.name}
                    onClick={() => {
                      setSelectedCoin(coin);
                      setCoinOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 hover:bg-[#2A2930]"
                  >
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={22}
                      height={22}
                    />
                    {coin.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Network Dropdown */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-Manrope text-gray-400">Network</p>
          <div className="relative">
            <button
              onClick={() => setNetworkOpen(!networkOpen)}
              className="flex w-full items-center cursor-pointer tex-sm justify-between rounded-lg border border-[#202026] px-4 py-3"
            >
              <span className="text-sm font-Manrope">{selectedNetwork}</span>
              <IoMdArrowDropdown size={18} />
            </button>

            {networkOpen && (
              <div className="absolute z-20 mt-2 w-full font-Manrope cursor-pointer rounded-lg border border-[#202026] bg-[#0A0A10]">
                {networks.map((net) => (
                  <button
                    key={net}
                    onClick={() => {
                      setSelectedNetwork(net);
                      setNetworkOpen(false);
                    }}
                    className="w-full px-4 py-3 font-Manrope cursor-pointer text-sm text-left hover:bg-[#2A2930]"
                  >
                    {net}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-Manrope text-gray-400">Amount</p>
          <input
            placeholder="Enter coin amount"
            className="w-full rounded-lg font-Manrope border border-[#202026] text-sm px-4 py-3 outline-none"
          />
        </div>

        {/* Admin Code */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-Manrope text-gray-400">
            Admin Verification Code
          </p>
          <input
            placeholder="Enter Google Authenticator code"
            className="w-full rounded-lg font-Manrope border border-[#202026] text-sm px-4 py-3 outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-Manrope text-gray-400">Password</p>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-lg font-Manrope border border-[#202026] text-sm px-4 py-3 outline-none"
          />
        </div>

        {/* Action Button */}
        <button className="w-full rounded-lg font-Manrope bg-[#0055FF] py-3 cursor-pointer">
          Deposit
        </button>
      </div>
    </div>
  );
}
