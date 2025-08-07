"use client";

import {
  BookOpen,
  Clock,
  BarChart3,
  Play,
  RotateCcw,
  CheckCircle,
} from "lucide-react";

interface Module {
  id: string;
  title: string;
  description: string;
  progress: number;
  difficulty: "Easy" | "Intermediate" | "High";
  estimatedHours: number;
  status: "not-started" | "in-progress" | "completed";
}

export function ModulesProgress() {
  const modules: Module[] = [
    {
      id: "1",
      title: "Risk Assessment Methodologies",
      description: "Learn various risk assessment techniques and tools",
      progress: 45,
      difficulty: "Intermediate",
      estimatedHours: 6,
      status: "in-progress",
    },
    {
      id: "2",
      title: "Risk Assessment Methodologies",
      description: "Learn various risk assessment techniques and tools",
      progress: 30,
      difficulty: "Intermediate",
      estimatedHours: 6,
      status: "in-progress",
    },
    {
      id: "3",
      title: "Risk Assessment Methodologies",
      description: "Learn various risk assessment techniques and tools",
      progress: 60,
      difficulty: "Intermediate",
      estimatedHours: 6,
      status: "in-progress",
    },
    {
      id: "4",
      title: "Risk Assessment Methodologies",
      description: "Learn various risk assessment techniques and tools",
      progress: 0,
      difficulty: "Intermediate",
      estimatedHours: 6,
      status: "not-started",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200";
      case "Intermediate":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200";
      case "High":
        return "bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200";
    }
  };

  const getActionButton = (module: Module) => {
    const href = `/dashboard/unit/${module.id}`;

    switch (module.status) {
      case "completed":
        return (
          <a
            href={href}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-sm"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Review</span>
          </a>
        );
      case "in-progress":
        return (
          <a
            href={href}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm"
          >
            <Play className="h-4 w-4" />
            <span>Continue</span>
          </a>
        );
      case "not-started":
        return (
          <a
            href={href}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg hover:from-purple-600 hover:to-violet-600 transition-all duration-200 shadow-sm"
          >
            <Play className="h-4 w-4" />
            <span>Start</span>
          </a>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-white" />;
      case "in-progress":
        return <Play className="h-4 w-4 text-white" />;
      case "not-started":
        return <BookOpen className="h-4 w-4 text-white" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm">
      <div className="space-y-4">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-all duration-200"
          >
            {/* Left Section - Icon and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                {getStatusIcon(module.status)}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">
                  {module.title}
                </h3>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <span>Progress</span>
                  </div>
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600">
                    {module.progress}%
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <span>Intermediate</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>30 lessons</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Action Button */}
            <div className="flex items-center space-x-3">
              {getActionButton(module)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
