"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Brain,
  Calendar,
} from "lucide-react";

interface PerformanceData {
  date: string;
  score: number;
  type: "quiz" | "mock" | "custom";
}

interface UnitAnalytics {
  unit: string;
  accuracy: number;
  effort: number;
  difficulty: "Easy" | "Intermediate" | "High";
  lastStudied: string;
}

export function DetailedInsights() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<"accuracy" | "effort" | "difficulty">(
    "accuracy"
  );

  const performanceData: PerformanceData[] = [
    { date: "2024-01-15", score: 65, type: "quiz" },
    { date: "2024-01-18", score: 72, type: "custom" },
    { date: "2024-01-22", score: 78, type: "mock" },
    { date: "2024-01-25", score: 74, type: "quiz" },
    { date: "2024-01-28", score: 81, type: "custom" },
    { date: "2024-02-01", score: 85, type: "quiz" },
    { date: "2024-02-05", score: 79, type: "mock" },
  ];

  const unitAnalytics: UnitAnalytics[] = [
    {
      unit: "Risk Governance",
      accuracy: 85,
      effort: 24,
      difficulty: "Easy",
      lastStudied: "2024-02-03",
    },
    {
      unit: "Risk Assessment",
      accuracy: 78,
      effort: 32,
      difficulty: "Intermediate",
      lastStudied: "2024-02-05",
    },
    {
      unit: "Risk Response",
      accuracy: 60,
      effort: 18,
      difficulty: "High",
      lastStudied: "2024-01-28",
    },
    {
      unit: "Risk Monitoring",
      accuracy: 72,
      effort: 28,
      difficulty: "Intermediate",
      lastStudied: "2024-02-01",
    },
    {
      unit: "Information Systems",
      accuracy: 68,
      effort: 22,
      difficulty: "High",
      lastStudied: "2024-01-30",
    },
    {
      unit: "Regulatory Compliance",
      accuracy: 55,
      effort: 12,
      difficulty: "High",
      lastStudied: "2024-01-25",
    },
  ];

  const sortedAnalytics = [...unitAnalytics].sort((a, b) => {
    switch (sortBy) {
      case "accuracy":
        return b.accuracy - a.accuracy;
      case "effort":
        return b.effort - a.effort;
      case "difficulty":
        const difficultyOrder = { Easy: 1, Intermediate: 2, High: 3 };
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      default:
        return 0;
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600";
      case "Intermediate":
        return "text-blue-600";
      case "High":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "quiz":
        return "bg-blue-100 text-blue-800";
      case "mock":
        return "bg-purple-100 text-purple-800";
      case "custom":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-card-foreground flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-primary" />
          Detailed Insights
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
        >
          <span className="text-sm font-medium">View Analytics</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {!isExpanded ? (
        /* Summary View */
        <div className="grid md:grid-cols-2 gap-6">
          {/* Performance Trend */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Recent Performance Trend
            </h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Last 7 Tests
                </span>
                <span className="text-sm font-medium text-green-600">
                  +12% improvement
                </span>
              </div>
              <div className="flex items-end space-x-1 h-16">
                {performanceData.slice(-7).map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-primary rounded-t"
                      style={{ height: `${(data.score / 100) * 100}%` }}
                    />
                    <span className="text-xs text-muted-foreground mt-1">
                      {data.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground flex items-center">
              <Brain className="h-5 w-5 mr-2 text-primary" />
              Maia's Recommendations
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-card-foreground font-medium mb-1">
                  Focus on Risk Response (60% accuracy)
                </p>
                <p className="text-xs text-muted-foreground">
                  Spend 2-3 hours this week reviewing mitigation strategies
                </p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-card-foreground font-medium mb-1">
                  Review Regulatory Compliance
                </p>
                <p className="text-xs text-muted-foreground">
                  Last studied 12 days ago - knowledge may be fading
                </p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-card-foreground font-medium mb-1">
                  Take Mock Exam 2
                </p>
                <p className="text-xs text-muted-foreground">
                  You're ready for the advanced mock exam
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Expanded Analytics View */
        <div className="space-y-6">
          {/* Performance Graph */}
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Performance Over Time
            </h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-end space-x-2 h-32 mb-4">
                {performanceData.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      {data.score}%
                    </div>
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        data.type === "quiz"
                          ? "bg-blue-500"
                          : data.type === "mock"
                          ? "bg-purple-500"
                          : "bg-green-500"
                      }`}
                      style={{ height: `${(data.score / 100) * 100}%` }}
                    />
                    <div className="mt-2 space-y-1">
                      <span
                        className={`text-xs px-1 py-0.5 rounded ${getTypeColor(
                          data.type
                        )}`}
                      >
                        {data.type}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {new Date(data.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Unit-wise Breakdown Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Unit-wise Performance
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-border rounded-lg text-sm bg-background"
              >
                <option value="accuracy">Sort by Accuracy</option>
                <option value="effort">Sort by Effort</option>
                <option value="difficulty">Sort by Difficulty</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-sm font-medium text-muted-foreground">
                      Unit
                    </th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">
                      Accuracy
                    </th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">
                      Effort (hrs)
                    </th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">
                      Difficulty
                    </th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">
                      Last Studied
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAnalytics.map((unit, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-3 text-sm font-medium text-card-foreground">
                        {unit.unit}
                      </td>
                      <td className="text-center py-3">
                        <span
                          className={`text-sm font-medium ${
                            unit.accuracy >= 80
                              ? "text-green-600"
                              : unit.accuracy >= 70
                              ? "text-blue-600"
                              : unit.accuracy >= 60
                              ? "text-orange-600"
                              : "text-red-600"
                          }`}
                        >
                          {unit.accuracy}%
                        </span>
                      </td>
                      <td className="text-center py-3 text-sm text-muted-foreground">
                        {unit.effort}
                      </td>
                      <td className="text-center py-3">
                        <span
                          className={`text-sm font-medium ${getDifficultyColor(
                            unit.difficulty
                          )}`}
                        >
                          {unit.difficulty}
                        </span>
                      </td>
                      <td className="text-center py-3 text-sm text-muted-foreground">
                        {new Date(unit.lastStudied).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Study Schedule Recommendations */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold text-card-foreground mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Recommended Study Schedule (Next 7 Days)
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="text-sm">Monday: Risk Response</span>
                  <span className="text-xs text-muted-foreground">2 hours</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="text-sm">
                    Wednesday: Information Systems
                  </span>
                  <span className="text-xs text-muted-foreground">
                    1.5 hours
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="text-sm">Friday: Regulatory Compliance</span>
                  <span className="text-xs text-muted-foreground">2 hours</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="text-sm">Saturday: Mock Exam 2</span>
                  <span className="text-xs text-muted-foreground">
                    3.5 hours
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background rounded">
                  <span className="text-sm">Sunday: Review weak areas</span>
                  <span className="text-xs text-muted-foreground">1 hour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
