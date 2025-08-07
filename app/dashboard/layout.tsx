"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutHeader } from "@/components/ui/layout-header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ChatWidget } from "@/components/dashboard/ChatWidget";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Simple Header - always the same */}
      <LayoutHeader
        variant="dashboard"
        showSearch={true}
        examDaysLeft={45}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar - always visible on desktop, below header */}
      <div
        className={`
        fixed left-0 top-16 sm:top-20 bottom-0 z-30 transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${sidebarCollapsed ? "lg:w-16" : "w-64 lg:w-72"}
      `}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Area - with left margin for sidebar and conditional right margin for chat */}
      <main
        className={`min-h-screen transition-all duration-300 pl-0 ${
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-72"
        } ${!pathname?.includes('/tutor') && !pathname?.includes('/content') ? 'lg:pr-80' : ''}`}
      >
        <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
          {children}
        </div>
      </main>

      {/* Fixed Chat Widget Sidebar - hidden on tutor and content pages */}
      {!pathname?.includes('/tutor') && !pathname?.includes('/content') && (
        <>
          <div className="hidden lg:block fixed right-0 top-16 sm:top-20 bottom-0 w-80 z-20">
            <ChatWidget />
          </div>
          
          {/* Mobile Chat Widget - popup style */}
          <div className="lg:hidden">
            <ChatWidget />
          </div>
        </>
      )}
    </div>
  );
}
