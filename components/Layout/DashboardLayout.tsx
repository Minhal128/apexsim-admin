"use client";

import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import MobileSidebar from "../Sidebar/MobileSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // ROOT — no horizontal overflow
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      {/* FIXED DESKTOP SIDEBAR */}
      <div className="fixed left-0 top-0 w-65 z-40 hidden md:block">
        <Sidebar />
      </div>

      {/* MOBILE SIDEBAR (unchanged) */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex min-h-screen flex-col md:ml-63">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 min-w-0 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}
