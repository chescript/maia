"use client";

import { useState } from "react";
import { ChevronDown, User, Settings, LogOut, Clock } from "lucide-react";

export function TopBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-primary">Maia MVP</h1>
      </div>

      {/* Center - CRMA Exam Countdown */}
      <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-lg">
        <Clock className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">
          CRMA Exam in 45 days
        </span>
      </div>

      {/* User Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg py-1 z-50">
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2 text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
