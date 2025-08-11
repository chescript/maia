"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Target,
  TrendingUp,
  Clock,
  BookOpen,
} from "lucide-react";

interface ModuleReadiness {
  name: string;
  accuracy: number;
  color: string;
}

export function ExamReadinessOverview() {
  const [isExpanded, setIsExpanded] = useState(false);
  const overallReadiness = 74;

  const moduleReadiness: ModuleReadiness[] = [
    { name: "Risk Governance", accuracy: 85, color: "text-green-600" },
    { name: "Risk Assessment", accuracy: 78, color: "text-blue-600" },
    { name: "Risk Response", accuracy: 60, color: "text-orange-600" },
    { name: "Risk Monitoring", accuracy: 72, color: "text-purple-600" },
    {
      name: "Information & Communication",
      accuracy: 68,
      color: "text-red-600",
    },
  ];

  // Calculate stroke-dasharray for circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (overallReadiness / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 mb-6 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
        {/* Left Section - Overview Title */}
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
            Overview
          </h2>

          {/* Circular Progress */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 lg:gap-6">
            <div className="relative flex-shrink-0">
              <svg
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {overallReadiness}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Ready</div>
                </div>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              <p>Based on your current progress and recent mock exams.</p>
            </div>
          </div>
        </div>

        {/* Right Section - Readiness Status and Stats */}
        <div className="flex-1 max-w-full md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto md:mx-0">
          {/* Readiness Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Your Readiness Status
              </span>
            </div>
            <p className="text-xs sm:text-sm text-green-700 mb-2 sm:mb-3 break-words">
              You're making great progress! Focus on Risk Response and Information & Communication to boost your score.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs">
              <div className="bg-green-100 px-2 py-1 rounded text-center sm:text-left">
                <span className="text-green-800">Strong Areas: 2</span>
              </div>
              <div className="bg-yellow-100 px-2 py-1 rounded text-center sm:text-left">
                <span className="text-yellow-800">Needs Work: 2</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
            <div className="bg-blue-50 rounded-lg p-2 sm:p-3 lg:p-4 text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                12
              </div>
              <div className="text-xs sm:text-sm text-blue-700">Mock Exams</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 sm:p-3 lg:p-4 text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                156
              </div>
              <div className="text-xs sm:text-sm text-purple-700">
                Study Hours
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-3 sm:mt-4 text-center sm:text-right">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">+5% from last week</div>
            <div className="flex items-center justify-center sm:justify-end gap-1">
              <div className="text-xs bg-gray-100 px-2 py-1 rounded">85%</div>
              <div className="text-xs bg-gray-900 text-white px-2 py-1 rounded">
                Review
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Exam Readiness Breakdown */}
      <div className="mt-6 border-t pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-lg font-semibold text-gray-900">
            Exam readiness breakdown
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {moduleReadiness.map((module, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-2 sm:gap-3"
              >
                <span className="text-sm font-medium text-gray-700 flex-shrink-0 break-words">
                  {module.name}
                </span>
                <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                  <div className="flex-1 min-w-0 sm:min-w-24 md:min-w-32 lg:min-w-40 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${module.accuracy}%` }}
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold ${module.color} flex-shrink-0 w-10 text-right`}
                  >
                    {module.accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
