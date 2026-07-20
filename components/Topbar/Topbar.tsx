"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Search, Moon } from "lucide-react";
import { HiBell } from "react-icons/hi";
import { IoMdArrowDropdown } from "react-icons/io";
import Image from "next/image";
import UserProfileDropdown from "./UserProfileDropdown";
import { apiRequest } from "@/lib/api";

interface TopbarProps {
  onMenuClick: () => void;
}

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

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch user profile and wallet data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await apiRequest("/profile/me");
        setUserProfile(data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    
    // Refresh profile every 30 seconds to get updated balance
    const interval = setInterval(fetchUserProfile, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDisplayName = () => {
    if (userProfile?.name) {
      return userProfile.name.split(" ")[0]; // First name only
    }
    return "User";
  };

  const getUSDTBalance = () => {
    if (userProfile?.wallet?.balances) {
      const usdt = userProfile.wallet.balances.find(b => b.asset === 'USDT');
      return usdt ? usdt.amount.toFixed(2) : '0.00';
    }
    return '0.00';
  };

  return (
    <header className="w-full flex h-16 items-center justify-between border-b border-white/10 bg-[#020617] px-4 md:px-6">
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-white/10 md:hidden"
        >
          <Menu className="h-5 w-5 text-white" />
        </button>

        <div className="hidden md:flex items-center gap-2 rounded-md bg-[#1B1A22] px-4 py-2.5">
          <Search className="h-4 w-4 text-white" />
          <input
            placeholder="Search"
            className="bg-transparent text-sm outline-none placeholder:text-gray-400 w-full text-white"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 relative" ref={wrapperRef}>
        {/* Balance Display */}
        {!loading && userProfile?.wallet && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1B1A22] border border-white/10">
            <div>
              <p className="text-xs text-gray-400">Balance</p>
              <p className="text-sm font-semibold text-white">
                ${getUSDTBalance()}
              </p>
            </div>
            <div className="text-xs text-gray-400 hidden md:block">USDT</div>
          </div>
        )}

        {/* Theme Toggle */}
        <button className="flex items-center justify-center h-10 w-10 rounded-md bg-[#131315] hover:bg-white/20 cursor-pointer">
          <Moon className="h-4.5 w-4.5 text-white" />
        </button>

        {/* Notifications */}
        <button className="relative flex items-center justify-center h-10 w-10 rounded-md bg-[#131315] hover:bg-white/20 cursor-pointer">
          <HiBell className="h-4.5 w-4.5 text-white" />
          <span className="absolute top-2.5 right-3 h-1 w-1 rounded-full bg-green-500" />
        </button>

        {/* Profile */}
        <div
          onClick={() => setDropdown(!dropdown)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="flex flex-col items-end gap-0 hidden sm:flex">
            <p className="text-xs font-semibold text-white">
              {getDisplayName()}
            </p>
            <p className="text-xs text-gray-400">
              {userProfile?.email || "Loading..."}
            </p>
          </div>

          <div className="flex items-center justify-center h-10 w-10 rounded-full overflow-hidden border-2 border-[#00B595] bg-[#131315]">
            {!loading ? (
              <Image
                src={userProfile?.avatar && userProfile.avatar.trim() !== "" ? userProfile.avatar : "/assets/profileimg.png"}
                alt="Profile"
                width={40}
                height={40}
                className="object-cover w-full h-full"
                unoptimized={true}
              />
            ) : null}
          </div>
          <IoMdArrowDropdown className="h-4 w-4 text-gray-300" />
        </div>

        <UserProfileDropdown
          open={dropdown}
          onClose={() => setDropdown(false)}
          userProfile={userProfile}
          onProfileUpdated={() => {
            // Refresh profile after update
            apiRequest("/profile/me").then(setUserProfile);
          }}
        />
      </div>
    </header>
  );
}
