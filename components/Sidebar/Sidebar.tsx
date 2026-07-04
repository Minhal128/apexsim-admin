"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  roles?: string[]; // Only show if user role is in this array
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

export default function Sidebar() {
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

  return (
    <aside className="w-64 bg-[#0E0D15] hidden h-screen md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <h1 className="text-2xl font-Manrope tracking-wide text-white">
          APEXSIM
        </h1>
      </div>

      {/* NAVIGATION */}
      <nav className="mt-6 flex flex-col gap-1 px-2">
        {visibleLinks.map((link) => {
          const isActive = pathname === link.path;
          const Icon = link.icon;

          return (
            <Link
              key={link.path}
              href={link.path}
              className={`flex items-center font-Manrope gap-3 px-4 py-3 rounded-md transition
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
  );
}
