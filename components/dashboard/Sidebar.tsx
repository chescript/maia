"use client";

import { useState } from "react";
import {
  Brain,
  TrendingDown,
  Clock,
  FileText,
  Home,
  BookOpen,
  PenTool,
  GraduationCap,
  ChevronRight,
  X,
  Bot,
} from "lucide-react";

interface AIPrompt {
  icon: React.ReactNode;
  text: string;
  action: () => void;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [activeNav, setActiveNav] = useState("dashboard");

  const aiPrompts: AIPrompt[] = [
    {
      icon: <Brain className="h-4 w-4" />,
      text: "Tell me more about my CRMA readiness score",
      action: () => console.log("AI prompt: readiness score"),
    },
    {
      icon: <TrendingDown className="h-4 w-4" />,
      text: "Where do I need to improve?",
      action: () => console.log("AI prompt: improvement areas"),
    },
    {
      icon: <Clock className="h-4 w-4" />,
      text: "Where should I focus my time today?",
      action: () => console.log("AI prompt: daily focus"),
    },
    {
      icon: <FileText className="h-4 w-4" />,
      text: "Generate a custom quiz based on my weak areas",
      action: () => console.log("AI prompt: custom quiz"),
    },
  ];

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
  ];

  return (
    <aside className="h-full w-64 lg:w-72 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/60 shadow-lg flex flex-col">
      {/* Header Spacer - to push content below the fixed header */}
      <div className="h-16 sm:h-20 flex-shrink-0"></div>
      
      {/* Mobile Close Button */}
      {onClose && (
        <div className="lg:hidden flex justify-end p-4 border-b border-slate-200/50 flex-shrink-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      )}
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
        {/* Navigation Links */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-4 px-2">
            Navigation
          </h3>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  setActiveNav(item.href.slice(1));
                  onClose?.();
                }}
                className={`flex items-center space-x-3 lg:space-x-4 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-200 group ${
                  item.isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-700 hover:bg-slate-100 hover:shadow-sm"
                }`}
              >
                <div className={`p-1 rounded-lg ${
                  item.isActive ? "bg-white/20" : "bg-slate-200 group-hover:bg-slate-300"
                }`}>
                  {item.icon}
                </div>
                <span className="text-sm font-semibold">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* AI Agent Quick-Prompt Menu */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
          <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center mr-2">
              <Brain className="h-2 w-2 text-white" />
            </div>
            AI Agent "Maia"
          </h3>
          <div className="space-y-1.5">
            {aiPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={prompt.action}
                className="w-full text-left p-2.5 rounded-lg bg-white/70 hover:bg-white hover:shadow-sm transition-all duration-200 group border border-white/50"
              >
                <div className="flex items-start space-x-2">
                  <div className="text-blue-600 mt-0.5 p-0.5 bg-blue-100 rounded text-xs">{prompt.icon}</div>
                  <span className="text-xs text-slate-700 leading-tight font-medium flex-1">
                    {prompt.text}
                  </span>
                  <ChevronRight className="h-2.5 w-2.5 text-slate-400 ml-auto mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-white/70 rounded-xl transition-all duration-200 hover:shadow-sm border border-white/50 bg-white/40 font-medium">
              📊 View Progress Report
            </button>
            <button className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-white/70 rounded-xl transition-all duration-200 hover:shadow-sm border border-white/50 bg-white/40 font-medium">
              ⚡ Quick Practice
            </button>
            <button className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-white/70 rounded-xl transition-all duration-200 hover:shadow-sm border border-white/50 bg-white/40 font-medium">
              📝 Review Mistakes
            </button>
          </div>
        </div>
        </div>
      </div>
    </aside>
  );
}
