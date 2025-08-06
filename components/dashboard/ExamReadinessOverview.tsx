"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Target, TrendingUp } from "lucide-react";

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
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (overallReadiness / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl border border-blue-200/50 p-6 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
            <Target className="h-5 w-5 text-white" />
          </div>
          CRMA Exam Readiness Overview
        </h2>
        <div className="flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
          <TrendingUp className="h-4 w-4 mr-1" />
          +5% from last week
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Circular Progress Indicator */}
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48">
            <svg
              className="w-48 h-48 transform -rotate-90"
              viewBox="0 0 200 200"
            >
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/20"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out drop-shadow-sm"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {overallReadiness}%
              </span>
              <span className="text-sm font-semibold text-slate-600 bg-white/70 px-2 py-1 rounded-full">Ready</span>
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-4 max-w-xs">
            Based on your current progress and recent mock exams.
          </p>
        </div>

        {/* Readiness Summary */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl border border-emerald-200/50">
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              Your Readiness Status
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              You're making great progress! Focus on Risk Response and
              Information & Communication to boost your score.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium border border-emerald-200">
                Strong Areas: 2
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium border border-amber-200">
                Needs Work: 2
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">12</div>
              <div className="text-xs text-slate-600 font-medium">Mock Exams</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">156</div>
              <div className="text-xs text-slate-600 font-medium">Study Hours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Module Breakdown */}
      <div className="mt-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <span className="font-medium text-card-foreground">
            Exam Readiness Breakdown
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {moduleReadiness.map((module, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-card-foreground">
                      {module.name}
                    </span>
                    <span className={`font-semibold ${module.color}`}>
                      {module.accuracy}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        module.accuracy >= 80
                          ? "bg-green-500"
                          : module.accuracy >= 70
                          ? "bg-blue-500"
                          : module.accuracy >= 60
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${module.accuracy}%` }}
                    />
                  </div>
                </div>
                <button className="ml-4 px-3 py-1 text-xs bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                  {module.accuracy >= 75 ? "Review" : "Study"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
