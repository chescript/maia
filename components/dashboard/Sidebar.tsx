"use client";

import { useState } from "react";
import {
  Home,
  BookOpen,
  PenTool,
  GraduationCap,
  X,
  Bot,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

interface SidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const [activeNav, setActiveNav] = useState("dashboard");

  const navItems: NavItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard",
      isActive: activeNav === "dashboard",
    },
    {
      icon: <Bot className="h-5 w-5" />,
      label: "AI Tutor",
      href: "/dashboard/tutor",
      isActive: activeNav === "tutor",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Content (Units)",
      href: "/dashboard/content",
      isActive: activeNav === "content",
    },
    {
      icon: <PenTool className="h-5 w-5" />,
      label: "Custom Test Builder",
      href: "/test-builder",
      isActive: activeNav === "test-builder",
    },
    {
      icon: <GraduationCap className="h-5 w-5" />,
      label: "Mock Exams",
      href: "/mock-exams",
      isActive: activeNav === "mock-exams",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "View Progress Report",
      href: "/dashboard/progress",
      isActive: activeNav === "progress",
    },
  ];

  return (
    <aside className={`h-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 shadow-lg flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64 lg:w-72'
    }`}>
      {/* Mobile Close Button & Desktop Collapse Toggle */}
      <div className="flex justify-between items-center p-4 border-b border-slate-200/50 flex-shrink-0">
        {/* Desktop Collapse Toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-slate-600" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            )}
          </button>
        )}
        
        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors ml-auto"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        )}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className={`space-y-6 lg:space-y-8 ${
          isCollapsed ? 'p-2' : 'p-4 lg:p-6'
        }`}>
          {/* Navigation Links */}
          <div>
            {!isCollapsed && (
              <h3 className="text-sm font-bold text-slate-800 mb-4 px-2">
                Navigation
              </h3>
            )}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    setActiveNav(item.href.slice(1));
                    onClose?.();
                  }}
                  className={`flex items-center rounded-xl transition-all duration-200 group relative ${
                    isCollapsed 
                      ? 'justify-center p-3 mx-1' 
                      : 'space-x-3 lg:space-x-4 px-3 lg:px-4 py-2.5 lg:py-3'
                  } ${
                    item.isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-700 hover:bg-slate-100 hover:shadow-sm"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div
                    className={`p-1 rounded-lg ${
                      item.isActive
                        ? "bg-white/20"
                        : "bg-slate-200 group-hover:bg-slate-300"
                    }`}
                  >
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="text-sm font-semibold">{item.label}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
