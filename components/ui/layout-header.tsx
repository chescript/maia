"use client";

import { useState } from "react";
import { ChevronDown, User, Settings, LogOut, Clock, Bell, Search, Menu, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LayoutHeaderProps {
  variant?: 'dashboard' | 'unit';
  unitTitle?: string;
  showBreadcrumbs?: boolean;
  showSearch?: boolean;
  examDaysLeft?: number;
  onMenuClick?: () => void;
}

export function LayoutHeader({ 
  variant = 'dashboard', 
  unitTitle,
  showBreadcrumbs = false,
  showSearch = false,
  examDaysLeft = 45,
  onMenuClick
}: LayoutHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
      <div className="px-3 sm:px-6 py-3 sm:py-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between mb-2">
          {/* Left Section - Menu & Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Menu Button */}
            {onMenuClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className="lg:hidden xl:hidden p-2 hover:bg-blue-100 rounded-lg"
              >
                <Menu className="h-5 w-5 text-slate-600" />
              </Button>
            )}
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">M</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Maia
              </h1>
            </div>
            
            {variant === 'dashboard' && (
              <div className="hidden md:flex items-center space-x-1 text-sm text-slate-600">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  CRMA Prep
                </span>
              </div>
            )}
          </div>

          {/* Center Section - Search or Exam Countdown */}
          <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-8">
            {showSearch ? (
              <div className={`relative transition-all duration-200 ${isSearchFocused ? 'scale-105' : ''}`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                <Input
                  placeholder="Search content, notes, or ask Maia..."
                  className="pl-8 sm:pl-10 pr-3 sm:pr-4 bg-white/70 border-slate-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs sm:text-sm h-8 sm:h-10"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            ) : (
              <div className="hidden sm:flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-orange-200">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                <span className="text-xs sm:text-sm font-semibold text-orange-700">
                  CRMA Exam in {examDaysLeft} days
                </span>
              </div>
            )}
          </div>

          {/* Right Section - Actions & User */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-1.5 sm:p-2 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white"></div>
            </Button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-slate-700">Sarah Chen</div>
                  <div className="text-xs text-slate-500">Level 2 Learner</div>
                </div>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
              </button>

              {/* Enhanced Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="font-medium text-slate-800">Sarah Chen</div>
                    <div className="text-sm text-slate-500">sarah@example.com</div>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center space-x-3 transition-colors">
                    <Settings className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-700">Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center space-x-3 text-red-600 transition-colors">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Breadcrumbs Row */}
        {showBreadcrumbs && (
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-slate-600 overflow-x-auto">
            <Home className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 flex-shrink-0" />
            <button className="text-blue-600 hover:text-blue-700 transition-colors font-medium whitespace-nowrap">
              Dashboard
            </button>
            {unitTitle && (
              <>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-800 font-medium truncate">{unitTitle}</span>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}