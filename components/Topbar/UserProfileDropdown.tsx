"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Upload, LogOut, Settings, User, Wallet } from "lucide-react";
import Image from "next/image";
import { apiRequest } from "@/lib/api";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  wallet?: {
    totalBalance: number;
    balances: Array<{ asset: string; amount: number }>;
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onProfileUpdated: () => void;
}

export default function UserProfileDropdown({
  open,
  onClose,
  userProfile,
  onProfileUpdated,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError("Please select a valid image file");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://apexsim-backend.onrender.com/api";
      const response = await fetch(`${apiUrl}/profile/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload avatar");
      }

      const data = await response.json();
      console.log("Avatar uploaded successfully:", data);
      setUploadError(null);
      onProfileUpdated();
    } catch (err) {
      console.error("Error uploading avatar:", err);
      setUploadError(
        err instanceof Error ? err.message : "Failed to upload image. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  const getUSDTBalance = () => {
    if (userProfile?.wallet?.balances) {
      const usdt = userProfile.wallet.balances.find(b => b.asset === 'USDT');
      return usdt ? usdt.amount.toFixed(2) : '0.00';
    }
    return '0.00';
  };

  const getTotalAssets = () => {
    if (userProfile?.wallet?.balances) {
      return userProfile.wallet.balances.length;
    }
    return 0;
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80 rounded-xl bg-[#0E0D15] border border-white/10 p-4 shadow-lg">
      {/* Profile Section */}
      <div className="mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Avatar with upload */}
          <div className="relative group">
            <div
              onClick={handleAvatarClick}
              className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-[#00B595] bg-[#131315] cursor-pointer flex items-center justify-center hover:opacity-80 transition"
            >
              <Image
                src={userProfile?.avatar && userProfile.avatar.trim() !== "" ? userProfile.avatar : "/assets/profileimg.png"}
                alt="Profile"
                width={56}
                height={56}
                className="object-cover w-full h-full"
                unoptimized={true}
              />

              {/* Upload icon overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Upload size={16} className="text-white" />
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">
              {userProfile?.name || "User"}
            </h3>
            <p className="text-xs text-gray-400 truncate">
              {userProfile?.email}
            </p>
            {uploading && (
              <p className="text-xs text-blue-400 mt-1">Uploading...</p>
            )}
            {uploadError && (
              <p className="text-xs text-red-400 mt-1">{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Balance Section */}
      {userProfile?.wallet && (
        <div className="mb-4 pb-4 border-b border-white/10">
          <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase">
            Wallet
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {/* USDT Balance */}
            <div className="bg-[#131315] rounded-lg p-3 border border-white/5">
              <p className="text-xs text-gray-400">USDT Balance</p>
              <p className="text-sm font-semibold text-[#00B595]">
                ${getUSDTBalance()}
              </p>
            </div>

            {/* Total Assets */}
            <div className="bg-[#131315] rounded-lg p-3 border border-white/5">
              <p className="text-xs text-gray-400">Total Assets</p>
              <p className="text-sm font-semibold text-white">
                {getTotalAssets()}
              </p>
            </div>
          </div>

          {/* All Balances */}
          {userProfile.wallet.balances.length > 0 && (
            <div className="mt-3 space-y-1 max-h-40 overflow-y-auto">
              {userProfile.wallet.balances.map((balance, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-xs px-2 py-1 bg-white/5 rounded"
                >
                  <span className="text-gray-400">{balance.asset}</span>
                  <span className="text-white font-semibold">
                    {balance.amount.toFixed(6)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Menu Items */}
      <div className="space-y-1">
        {/* Profile */}
      <Link href="/DashboardMain/systemsettings">
        <button
          onClick={onClose}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition"
        >
            <User size={16} />
          Profile
        </button>
      </Link>

        {/* Wallet */}
        <Link href="/DashboardMain/wallet">
          <button
            onClick={onClose}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition"
          >
            <Wallet size={16} />
            Wallet
          </button>
        </Link>

        {/* Settings */}
      <Link href="/DashboardMain/systemsettings">
        <button
          onClick={onClose}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition"
        >
            <Settings size={16} />
          Settings
        </button>
      </Link>
      </div>

      {/* Divider */}
      <div className="my-2 h-px w-full bg-white/10" />

      {/* Logout */}
      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/10 rounded-lg transition">
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}
