"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";
import RecenteActivities from "../Modal/RecenteActivities";
import { disableUser, enableUser, resetUserPassword } from "@/lib/adminApi";

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSuspended, setIsSuspended] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  useEffect(() => {
    if (user) {
      setIsSuspended(user.isActive === false);
    }
  }, [user]);

  if (!open || !user) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const displayName = user.name && user.name.trim() !== "" ? user.name : "Unknown User";
  
  // If the avatar is the default relative path, fallback to ui-avatars since Admin panel doesn't have web images
  const hasAvatar = user.avatar && user.avatar !== "/images/manimage.png";
  const avatarUrl = hasAvatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

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
          <img
            src={avatarUrl}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover"
          />

          <div className="flex-1">
            <h3 className="text-white font-Manrope">{displayName}</h3>

            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-Manrope text-[#828A92] truncate">
                {user.email}
              </p>

              <div className="flex items-center shrink-0 gap-1">
                {user.country && user.country.length === 2 ? (
                  <ReactCountryFlag countryCode={user.country} svg style={{ width: '1.2em', height: '1.2em' }} />
                ) : (
                  <span className="text-[#828A92] text-xs">🌍</span>
                )}
                <span className="text-xs font-Manrope text-[#828A92] mr-2">
                  {user.country || "Not specified"}
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
          <RecenteActivities userId={user._id} />
        </div>

        <div className="mt-5 px-5 flex flex-col gap-2">
          {showPasswordInput && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="flex-1 bg-[#1F1F26] text-white text-sm px-4 py-2 rounded-lg border border-[#434B5C]"
              />
              <button
                onClick={async () => {
                  try {
                    const newPass = passwordInput || "ApexUser@123";
                    await resetUserPassword(user._id, newPass);
                    showToast(`Password reset to ${newPass}`);
                    setShowPasswordInput(false);
                    setPasswordInput("");
                  } catch (e) {
                    showToast("Failed to reset password");
                  }
                }}
                className="bg-[#00B595] text-white text-sm px-4 py-2 rounded-lg"
              >
                Confirm
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <button 
              onClick={async () => {
                try {
                  if (isSuspended) {
                    await enableUser(user._id);
                    setIsSuspended(false);
                    showToast("User unsuspended successfully");
                  } else {
                    await disableUser(user._id);
                    setIsSuspended(true);
                    showToast("User suspended successfully");
                  }
                } catch (e) {
                  showToast("Action failed");
                }
              }}
              className={`flex-1 rounded-lg cursor-pointer font-Manrope py-3 text-sm text-white ${isSuspended ? 'bg-[#00B595]' : 'bg-[#FF383C]'}`}
            >
              {isSuspended ? "Unsuspend user" : "Suspend user"}
            </button>
            <button 
              onClick={() => setShowPasswordInput(!showPasswordInput)}
              className="flex-1 rounded-lg bg-[#1F1F26] cursor-pointer font-Manrope py-3 text-sm text-white"
            >
              Reset password
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="fixed bottom-10 right-10 bg-[#00B595] text-white px-6 py-3 rounded-lg shadow-lg z-[60] font-Manrope animate-slideIn">
            {toastMessage}
          </div>
        )}
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
