"use client";

import {
  PenTool,
  GraduationCap,
  Clock,
  Target,
  Users,
  Award,
} from "lucide-react";

export function ExamTestSection() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm">
      <div className="flex items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground flex items-center">
          <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary" />
          <span className="hidden sm:inline">Interactive Exam & Test Section</span>
          <span className="sm:hidden">Exam & Tests</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Custom Test Builder Card */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 md:p-5 xl:p-6 hover:shadow-lg transition-all duration-300 flex flex-col">
          <div className="flex items-start mb-3 md:mb-4">
            <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
              <PenTool className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-sm md:text-base xl:text-lg font-semibold text-card-foreground leading-tight">
                Custom Test Builder
              </h3>
            </div>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">
            Build a custom test focused on your weakest topics. AI-powered
            question selection based on your performance data.
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-start text-xs text-muted-foreground">
              <Target className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">Adaptive difficulty based on progress</span>
            </div>
            <div className="flex items-start text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">10-50 questions, 15-90 minutes</span>
            </div>
          </div>

          <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm md:text-base mt-auto">
            Create Custom Test
          </button>
        </div>

        {/* Mock Exam 1 Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-25 border border-blue-200 rounded-lg p-4 md:p-5 xl:p-6 hover:shadow-lg transition-all duration-300 flex flex-col">
          <div className="flex items-start mb-3 md:mb-4">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-sm md:text-base xl:text-lg font-semibold text-card-foreground leading-tight">
                Mock Exam 1
              </h3>
            </div>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">
            Simulate the real CRMA exam experience with comprehensive questions
            covering all domains.
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-start text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">150 questions, 3.5 hours</span>
            </div>
            <div className="flex items-start text-xs text-muted-foreground">
              <Users className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">Taken by 1,247 students</span>
            </div>
            <div className="flex items-start text-xs text-green-600">
              <Award className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">Last score: 78% (Pass)</span>
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base mt-auto">
            Start Mock Exam 1
          </button>
        </div>

        {/* Mock Exam 2 Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-25 border border-purple-200 rounded-lg p-4 md:p-5 xl:p-6 hover:shadow-lg transition-all duration-300 flex flex-col">
          <div className="flex items-start mb-3 md:mb-4">
            <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-sm md:text-base xl:text-lg font-semibold text-card-foreground leading-tight">
                Mock Exam 2
              </h3>
            </div>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">
            Advanced mock exam with higher difficulty questions to challenge
            your knowledge and readiness.
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-start text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">150 questions, 3.5 hours</span>
            </div>
            <div className="flex items-start text-xs text-muted-foreground">
              <Users className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">Taken by 892 students</span>
            </div>
            <div className="flex items-start text-xs text-orange-600">
              <Award className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
              <span className="leading-tight">Not attempted yet</span>
            </div>
          </div>

          <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm md:text-base mt-auto">
            Start Mock Exam 2
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 md:mt-6 grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 p-4 md:p-5 bg-muted/30 rounded-lg">
        <div className="text-center py-2">
          <div className="text-lg md:text-xl font-bold text-card-foreground mb-1">24</div>
          <div className="text-xs md:text-sm text-muted-foreground leading-tight">
            Custom Tests Taken
          </div>
        </div>
        <div className="text-center py-2">
          <div className="text-lg md:text-xl font-bold text-card-foreground mb-1">78%</div>
          <div className="text-xs md:text-sm text-muted-foreground leading-tight">
            Average Score
          </div>
        </div>
        <div className="text-center py-2">
          <div className="text-lg md:text-xl font-bold text-card-foreground mb-1">2</div>
          <div className="text-xs md:text-sm text-muted-foreground leading-tight">
            Mock Exams Available
          </div>
        </div>
        <div className="text-center py-2">
          <div className="text-lg md:text-xl font-bold text-card-foreground mb-1">45</div>
          <div className="text-xs md:text-sm text-muted-foreground leading-tight">
            Days Until Exam
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-4 p-4 md:p-5 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 className="font-semibold text-card-foreground mb-3 flex items-center text-sm md:text-base">
          <Target className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
          AI Recommendations
        </h4>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          Based on your progress, we recommend taking a custom test focusing on{" "}
          <strong>Risk Response</strong> and{" "}
          <strong>Information Systems</strong> before attempting Mock Exam 2.
        </p>
      </div>
    </div>
  );
}
