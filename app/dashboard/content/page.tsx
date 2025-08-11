"use client";

import { useState } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Circle,
  Play,
  FileText,
  Video,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Star,
  BarChart3,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Unit {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  isLocked: boolean;
  rating: number;
  enrolledStudents: number;
  lastAccessed?: string;
}

interface Lesson {
  id: string;
  title: string;
  type: "video" | "reading" | "quiz" | "practice";
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

const units: Unit[] = [
  {
    id: "1",
    title: "Risk Management Fundamentals",
    description:
      "Introduction to risk management principles, frameworks, and basic concepts essential for CRMA certification.",
    progress: 85,
    totalLessons: 12,
    completedLessons: 10,
    estimatedTime: "4.5 hours",
    difficulty: "Beginner",
    category: "Foundation",
    isLocked: false,
    rating: 4.8,
    enrolledStudents: 1250,
    lastAccessed: "2 days ago",
  },
  {
    id: "2",
    title: "Risk Assessment Methodologies",
    description:
      "Deep dive into various risk assessment techniques, quantitative and qualitative approaches.",
    progress: 60,
    totalLessons: 15,
    completedLessons: 9,
    estimatedTime: "6 hours",
    difficulty: "Intermediate",
    category: "Assessment",
    isLocked: false,
    rating: 4.7,
    enrolledStudents: 980,
    lastAccessed: "1 week ago",
  },
  {
    id: "3",
    title: "Internal Controls & Governance",
    description:
      "Understanding internal control systems, governance structures, and compliance frameworks.",
    progress: 30,
    totalLessons: 18,
    completedLessons: 5,
    estimatedTime: "7.5 hours",
    difficulty: "Intermediate",
    category: "Governance",
    isLocked: false,
    rating: 4.9,
    enrolledStudents: 1100,
    lastAccessed: "3 days ago",
  },
  {
    id: "4",
    title: "Advanced Risk Analytics",
    description:
      "Statistical methods, modeling techniques, and advanced analytics for risk management.",
    progress: 0,
    totalLessons: 20,
    completedLessons: 0,
    estimatedTime: "8 hours",
    difficulty: "Advanced",
    category: "Analytics",
    isLocked: true,
    rating: 4.6,
    enrolledStudents: 750,
  },
  {
    id: "5",
    title: "Regulatory Compliance",
    description:
      "Comprehensive coverage of regulatory requirements, compliance monitoring, and reporting.",
    progress: 0,
    totalLessons: 14,
    completedLessons: 0,
    estimatedTime: "5.5 hours",
    difficulty: "Advanced",
    category: "Compliance",
    isLocked: true,
    rating: 4.8,
    enrolledStudents: 890,
  },
  {
    id: "6",
    title: "Crisis Management & Business Continuity",
    description:
      "Strategies for crisis response, business continuity planning, and disaster recovery.",
    progress: 0,
    totalLessons: 16,
    completedLessons: 0,
    estimatedTime: "6.5 hours",
    difficulty: "Advanced",
    category: "Crisis Management",
    isLocked: true,
    rating: 4.7,
    enrolledStudents: 650,
  },
];

const categories = [
  "All",
  "Foundation",
  "Assessment",
  "Governance",
  "Analytics",
  "Compliance",
  "Crisis Management",
];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

export default function ContentPage() {

  const filteredUnits = units;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const totalUnits = units.length;
  const completedUnits = units.filter((unit) => unit.progress === 100).length;
  const inProgressUnits = units.filter(
    (unit) => unit.progress > 0 && unit.progress < 100
  ).length;
  const overallProgress = Math.round(
    units.reduce((acc, unit) => acc + unit.progress, 0) / totalUnits
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">CRMA Study Content</h1>
            <p className="text-blue-100 text-lg">
              Master risk management concepts through structured learning units
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <div className="text-sm text-blue-100">Overall Progress</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">
                {completedUnits}/{totalUnits}
              </div>
              <div className="text-sm text-blue-100">Units Completed</div>
            </div>
          </div>
        </div>
      </div>



      {/* Units List */}
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm">
        <div className="space-y-4">
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-all duration-200 gap-3 sm:gap-4 ${
                unit.isLocked ? "opacity-60" : ""
              }`}
            >
              {/* Left Section - Icon and Title */}
              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    unit.isLocked ? "opacity-50" : ""
                  }`}
                >
                  {unit.progress === 100 ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : unit.progress > 0 ? (
                    <Play className="h-4 w-4 text-white" />
                  ) : (
                    <BookOpen className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                      {unit.title}
                    </h3>
                    {unit.isLocked && (
                      <Badge
                        variant="secondary"
                        className="text-xs self-start sm:self-center"
                      >
                        Locked
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span>Progress</span>
                      <span className="text-slate-600 font-medium">
                        {unit.progress}%
                      </span>
                    </div>
                    <div className="flex-1 max-w-xs bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                        style={{ width: `${unit.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(
                          unit.difficulty
                        )}`}
                      >
                        {unit.difficulty}
                      </span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FileText className="h-3 w-3" />
                      <span>
                        {unit.completedLessons}/{unit.totalLessons} lessons
                      </span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{unit.estimatedTime}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Section - Action Button */}
              <div className="flex items-center justify-end sm:justify-start flex-shrink-0">
                <Button
                  className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-sm text-sm font-medium min-w-0 whitespace-nowrap"
                  disabled={unit.isLocked}
                  onClick={() =>
                    (window.location.href = `/dashboard/unit/${unit.id}`)
                  }
                >
                  {unit.isLocked ? (
                    "Locked"
                  ) : unit.progress === 0 ? (
                    <>
                      <Play className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline">Start</span>
                    </>
                  ) : unit.progress === 100 ? (
                    <>
                      <RotateCcw className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline">Review</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline">Continue</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredUnits.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No units found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  );
}
