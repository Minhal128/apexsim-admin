"use client";

import Image from "next/image";
import { X } from "lucide-react";
import RecenteActivities from "../Modal/RecenteActivities";

import Avatar from "@/public/assets/profileimg.png";
import USFlag from "@/public/assets/flag.png";
import BTC from "@/public/assets/bit.png";
import ETH from "@/public/assets/eth.png";
import SOL from "@/public/assets/sol.png";

interface Props {
  open: boolean;
  user?: any;
  onClose: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export default function UserDetailsModal({
  open,
  user,
  onClose,
  onDeposit,
  onWithdraw,
}: Props) {
  if (!open || !user) return null;

  const displayName = user.name && user.name.trim() !== "" ? user.name : "Unknown User";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  const totalBalance = user.wallet?.balances?.find((b: any) => b.asset === 'USDT')?.amount || 0;
  const balances = user.wallet?.balances || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className="h-full w-full md:max-w-125 bg-[#0E0D15] p-4 animate-slideIn overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-Manrope">User Details</h2>
          <button onClick={onClose}>
            <X className="text-gray-400 cursor-pointer hover:text-white" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Image
            src={avatarUrl}
            alt="profile"
            width={48}
            height={48}
            className="rounded-full"
            unoptimized
          />

          <div className="flex-1">
            <h3 className="text-white font-Manrope">{displayName}</h3>

            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-Manrope text-[#828A92] truncate">
                {user.email}
              </p>

              <div className="flex items-center  shrink-0">
                <Image src={USFlag} alt="US" width={16} height={16} />
                <span className="text-xs pl-1 font-Manrope text-[#828A92]">
                  United States
                </span>
                <span className="text-xs px-1 text-[#828A92]">
                  ID: #{user.id}
                </span>
                <span className={`px-2 py-0.5 font-Manrope text-sm text-white ${user.kyc === "Verified" ? "text-[#00B595]" : "text-[#FF8D28]"}`}>
                  {user.kyc}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[#0e0e0e62] border border-[#202026] p-4 mb-4">
          {/* Wallet */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm font-Manrope">
                Wallet Balance (USDT)
              </p>
              <h3 className="text-2xl text-white font-Manrope">${totalBalance.toFixed(2)}</h3>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onWithdraw}
                className="rounded-lg bg-[#1F1F26] cursor-pointer font-Manrope px-4 py-2 text-sm text-white"
              >
                Withdraw
              </button>
              <button
                onClick={onDeposit}
                className="rounded-lg bg-[#1F1F26] cursor-pointer font-Manrope px-4 py-2 text-sm text-white"
              >
                Deposit
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-white/5 mb-3" />

          {/* Assets Header */}
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm text-gray-400 font-Manrope">Assets</h4>
            <span className="text-sm text-gray-400 font-Manrope">Value</span>
          </div>

          {/* Assets List */}
          <div className="space-y-4">
            {balances.length === 0 ? (
              <p className="text-sm text-gray-400 font-Manrope">No assets found.</p>
            ) : balances.map((item: any, i: number) => {
              let icon = BTC;
              if (item.asset === 'ETH') icon = ETH;
              else if (item.asset === 'SOL') icon = SOL;

              // Usually, real crypto amounts have more decimals. Let's show up to 6.
              const amountStr = item.amount.toFixed(6) + " " + item.asset;
              
              return (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={icon}
                      alt={item.asset}
                      width={30}
                      height={30}
                    />
                    <div>
                      <p className="text-sm text-white font-Manrope">
                        {item.asset}
                      </p>
                      <p className="text-xs text-gray-400 font-Manrope">
                        {amountStr}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-white font-Manrope">
                    {/* Assuming $1 for USDT, and we'd need actual prices for others. For now, if USDT, show $amount */}
                    {item.asset === 'USDT' ? `$${item.amount.toFixed(2)}` : '--'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <RecenteActivities />
        </div>

        <div className="mt-5 px-5 flex gap-2">
          <button className="flex-1 rounded-lg cursor-pointer bg-[#FF383C] font-Manrope py-3 text-sm text-white">
            Suspend user
          </button>
          <button className="flex-1 rounded-lg bg-[#1F1F26] cursor-pointer font-Manrope py-3 text-sm text-white">
            Reset password
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
