"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
  MdDashboard,
  MdPeople,
  MdAccountBalanceWallet,
  MdTrendingUp,
  MdShowChart,
  MdReceiptLong,
  MdSecurity,
  MdSettings,
} from "react-icons/md";
import { apiRequest } from "@/lib/api";

interface NavLink {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  roles?: string[];
}

/* ===== ALL AVAILABLE LINKS ===== */
const allLinks: NavLink[] = [
  {
    name: "Dashboard",
    path: "/DashboardMain/dashboard",
    icon: MdDashboard,
    roles: ["admin", "user"],
  },
  {
    name: "User Management",
    path: "/DashboardMain/user-management",
    icon: MdPeople,
    roles: ["admin"],
  },
  {
    name: "Wallet & Funds",
    path: "/DashboardMain/wallet",
    icon: MdAccountBalanceWallet,
    roles: ["admin", "user"],
  },
  {
    name: "Trading Management",
    path: "/DashboardMain/tradingmanagement",
    icon: MdTrendingUp,
    roles: ["admin", "user"],
  },
  {
    name: "Market Price & Feeds",
    path: "/DashboardMain/marketpricefeeds",
    icon: MdShowChart,
    roles: ["admin", "user"],
  },
  {
    name: "Orders & History",
    path: "/DashboardMain/ordershistory",
    icon: MdReceiptLong,
    roles: ["admin", "user"],
  },
  {
    name: "Roles & Permissions",
    path: "/DashboardMain/rolespermissions",
    icon: MdSecurity,
    roles: ["admin"],
  },
  {
    name: "System Settings",
    path: "/DashboardMain/systemsettings",
    icon: MdSettings,
    roles: ["admin"],
  },
];

interface MobileSidebarProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function MobileSidebar({ onClose, isOpen }: MobileSidebarProps) {
  const pathname = usePathname();
  const [visibleLinks, setVisibleLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userProfile = await apiRequest("/profile/me");
        const userRole = userProfile?.role || "user";
        // Filter links based on user role
        const filtered = allLinks.filter(
          (link) => !link.roles || link.roles.includes(userRole)
        );
        setVisibleLinks(filtered);
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        // Default to show only user-accessible links
        setVisibleLinks(allLinks.filter((link) => !link.roles || link.roles.includes("user")));
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0E0D15] md:hidden flex flex-col h-screen transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between border-b border-white/10">
          <h1 className="text-2xl font-Manrope pl-3 tracking-wide text-white">
            APEXSIM
          </h1>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            <IoMdCloseCircleOutline size={24} className="text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex flex-col gap-1 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={handleLinkClick}
                className={`flex items-center font-Manrope gap-3 px-4 py-3 rounded-md transition-all duration-200 hover-lift
                  ${
                    isActive
                      ? "bg-[#0055FF] text-black"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-black" : "text-white"}
                />
                <span className="text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
