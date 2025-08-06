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

export function Sidebar() {
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
      icon: <BookOpen className="h-5 w-5" />,
      label: "Content (Units)",
      href: "/content",
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
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* AI Agent Quick-Prompt Menu */}
        <div>
          <h3 className="text-sm font-semibold text-sidebar-foreground mb-3 flex items-center">
            <Brain className="h-4 w-4 mr-2 text-primary" />
            AI Agent "Maia"
          </h3>
          <div className="space-y-2">
            {aiPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={prompt.action}
                className="w-full text-left p-3 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors group"
              >
                <div className="flex items-start space-x-2">
                  <div className="text-primary mt-0.5">{prompt.icon}</div>
                  <span className="text-xs text-sidebar-foreground leading-relaxed">
                    {prompt.text}
                  </span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground ml-auto mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">
            Navigation
          </h3>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActiveNav(item.href.slice(1))}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  item.isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors">
              📊 View Progress Report
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors">
              ⚡ Quick Practice
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors">
              📝 Review Mistakes
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
