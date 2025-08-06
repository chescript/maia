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
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-card-foreground flex items-center">
          <GraduationCap className="h-6 w-6 mr-2 text-primary" />
          Interactive Exam & Test Section
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Custom Test Builder Card */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-primary/20 rounded-lg">
              <PenTool className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground ml-3">
              Custom Test Builder
            </h3>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Build a custom test focused on your weakest topics. AI-powered
            question selection based on your performance data.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-xs text-muted-foreground">
              <Target className="h-3 w-3 mr-2" />
              <span>Adaptive difficulty based on your progress</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-2" />
              <span>10-50 questions, 15-90 minutes</span>
            </div>
          </div>

          <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
            Create Custom Test
          </button>
        </div>

        {/* Mock Exam 1 Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-25 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground ml-3">
              Mock Exam 1
            </h3>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Simulate the real CRMA exam experience with comprehensive questions
            covering all domains.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-2" />
              <span>150 questions, 3.5 hours</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="h-3 w-3 mr-2" />
              <span>Taken by 1,247 students</span>
            </div>
            <div className="flex items-center text-xs text-green-600">
              <Award className="h-3 w-3 mr-2" />
              <span>Last score: 78% (Pass)</span>
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Start Mock Exam 1
          </button>
        </div>

        {/* Mock Exam 2 Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-25 border border-purple-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground ml-3">
              Mock Exam 2
            </h3>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Advanced mock exam with higher difficulty questions to challenge
            your knowledge and readiness.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-2" />
              <span>150 questions, 3.5 hours</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="h-3 w-3 mr-2" />
              <span>Taken by 892 students</span>
            </div>
            <div className="flex items-center text-xs text-orange-600">
              <Award className="h-3 w-3 mr-2" />
              <span>Not attempted yet</span>
            </div>
          </div>

          <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
            Start Mock Exam 2
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-card-foreground">24</div>
          <div className="text-xs text-muted-foreground">
            Custom Tests Taken
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-card-foreground">78%</div>
          <div className="text-xs text-muted-foreground">Average Score</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-card-foreground">2</div>
          <div className="text-xs text-muted-foreground">
            Mock Exams Available
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-card-foreground">45</div>
          <div className="text-xs text-muted-foreground">Days Until Exam</div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 className="font-semibold text-card-foreground mb-2 flex items-center">
          <Target className="h-4 w-4 mr-2 text-primary" />
          AI Recommendations
        </h4>
        <p className="text-sm text-muted-foreground">
          Based on your progress, we recommend taking a custom test focusing on{" "}
          <strong>Risk Response</strong> and{" "}
          <strong>Information Systems</strong> before attempting Mock Exam 2.
        </p>
      </div>
    </div>
  );
}
