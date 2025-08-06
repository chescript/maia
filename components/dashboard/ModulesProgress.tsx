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
      title: "Risk Governance Fundamentals",
      description: "Introduction to risk governance principles and frameworks",
      progress: 100,
      difficulty: "Easy",
      estimatedHours: 4,
      status: "completed",
    },
    {
      id: "2",
      title: "Risk Assessment Methodologies",
      description: "Learn various risk assessment techniques and tools",
      progress: 75,
      difficulty: "Intermediate",
      estimatedHours: 6,
      status: "in-progress",
    },
    {
      id: "3",
      title: "Risk Response Strategies",
      description: "Develop effective risk response and mitigation strategies",
      progress: 45,
      difficulty: "High",
      estimatedHours: 8,
      status: "in-progress",
    },
    {
      id: "4",
      title: "Risk Monitoring & Reporting",
      description: "Master risk monitoring techniques and reporting standards",
      progress: 0,
      difficulty: "Intermediate",
      estimatedHours: 5,
      status: "not-started",
    },
    {
      id: "5",
      title: "Information Systems & Communication",
      description: "Understanding risk information systems and communication",
      progress: 30,
      difficulty: "High",
      estimatedHours: 7,
      status: "in-progress",
    },
    {
      id: "6",
      title: "Regulatory Compliance",
      description: "Navigate regulatory requirements and compliance frameworks",
      progress: 0,
      difficulty: "High",
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
          <a href={href} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-sm">
            <RotateCcw className="h-4 w-4" />
            <span>Review</span>
          </a>
        );
      case "in-progress":
        return (
          <a href={href} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm">
            <Play className="h-4 w-4" />
            <span>Continue</span>
          </a>
        );
      case "not-started":
        return (
          <a href={href} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg hover:from-purple-600 hover:to-violet-600 transition-all duration-200 shadow-sm">
            <Play className="h-4 w-4" />
            <span>Start</span>
          </a>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <BarChart3 className="h-5 w-5 text-blue-600" />;
      case "not-started":
        return <BookOpen className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50 rounded-2xl border border-slate-200/50 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          Modules Progress
        </h2>
        <div className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
          {modules.filter((m) => m.status === "completed").length} of{" "}
          {modules.length} completed
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <div
            key={module.id}
            className="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-xl p-5 hover:shadow-lg hover:bg-white/90 transition-all duration-200 hover:-translate-y-1"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(module.status)}
                <h3 className="font-semibold text-card-foreground text-sm leading-tight">
                  {module.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
              {module.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-card-foreground">
                  Progress
                </span>
                <span className="text-xs text-muted-foreground">
                  {module.progress}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    module.progress === 100
                      ? "bg-gradient-to-r from-emerald-400 to-green-500"
                      : module.progress > 0
                      ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                      : "bg-muted"
                  }`}
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(
                    module.difficulty
                  )}`}
                >
                  {module.difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{module.estimatedHours}h</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">{getActionButton(module)}</div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-card-foreground">
            {Math.round(
              modules.reduce((acc, m) => acc + m.progress, 0) / modules.length
            )}
            %
          </div>
          <div className="text-xs text-muted-foreground">Overall Progress</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-card-foreground">
            {modules.reduce((acc, m) => acc + m.estimatedHours, 0)}h
          </div>
          <div className="text-xs text-muted-foreground">Total Study Time</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-card-foreground">
            {modules.filter((m) => m.status === "in-progress").length}
          </div>
          <div className="text-xs text-muted-foreground">In Progress</div>
        </div>
      </div>
    </div>
  );
}
