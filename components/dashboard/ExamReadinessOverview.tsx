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
    <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-2xl p-6 shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-white">
          CRMA Study Content
        </h1>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-2xl font-bold">29%</div>
            <div className="text-sm opacity-90">Overall Progress</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">0/6</div>
            <div className="text-sm opacity-90">Units Completed</div>
          </div>
        </div>
      </div>

    </div>
  );
}
