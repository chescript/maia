'use client'

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutHeader } from "@/components/ui/layout-header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ChatWidget } from "@/components/dashboard/ChatWidget";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div className={`
        fixed left-0 top-0 bottom-0 z-30 w-64 lg:w-72 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area - with left margin to account for fixed sidebar */}
      <main className="min-h-screen pl-0 lg:pl-72">
        <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
          {children}
        </div>
      </main>

      {/* Persistent Chat Widget */}
      <div className="hidden md:block">
        <ChatWidget />
      </div>
    </div>
  );
}