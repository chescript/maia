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
  Search,
  Filter,
  ChevronRight,
  Star,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    description: "Introduction to risk management principles, frameworks, and basic concepts essential for CRMA certification.",
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
    description: "Deep dive into various risk assessment techniques, quantitative and qualitative approaches.",
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
    description: "Understanding internal control systems, governance structures, and compliance frameworks.",
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
    description: "Statistical methods, modeling techniques, and advanced analytics for risk management.",
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
    description: "Comprehensive coverage of regulatory requirements, compliance monitoring, and reporting.",
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
    description: "Strategies for crisis response, business continuity planning, and disaster recovery.",
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

const categories = ["All", "Foundation", "Assessment", "Governance", "Analytics", "Compliance", "Crisis Management"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

export default function ContentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredUnits = units.filter((unit) => {
    const matchesSearch = unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || unit.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || unit.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const totalUnits = units.length;
  const completedUnits = units.filter(unit => unit.progress === 100).length;
  const inProgressUnits = units.filter(unit => unit.progress > 0 && unit.progress < 100).length;
  const overallProgress = Math.round(units.reduce((acc, unit) => acc + unit.progress, 0) / totalUnits);

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
              <div className="text-2xl font-bold">{completedUnits}/{totalUnits}</div>
              <div className="text-sm text-blue-100">Units Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{completedUnits}</div>
                <div className="text-sm text-gray-600">Completed Units</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Play className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{inProgressUnits}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{totalUnits - completedUnits - inProgressUnits}</div>
                <div className="text-sm text-gray-600">Not Started</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search units by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUnits.map((unit) => (
          <Card key={unit.id} className={`hover:shadow-lg transition-all duration-200 ${unit.isLocked ? 'opacity-60' : 'hover:scale-[1.02]'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    {unit.title}
                    {unit.isLocked && <Badge variant="secondary">Locked</Badge>}
                  </CardTitle>
                  <p className="text-gray-600 text-sm leading-relaxed">{unit.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className={getDifficultyColor(unit.difficulty)}>
                  {unit.difficulty}
                </Badge>
                <Badge variant="outline">{unit.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {unit.rating}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{unit.progress}%</span>
                  </div>
                  <Progress value={unit.progress} className="h-2" />
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{unit.completedLessons}/{unit.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{unit.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{unit.enrolledStudents.toLocaleString()} students</span>
                  </div>
                  {unit.lastAccessed && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Last: {unit.lastAccessed}</span>
                    </div>
                  )}
                </div>
                
                {/* Action Button */}
                <Button 
                  className="w-full mt-4" 
                  disabled={unit.isLocked}
                  onClick={() => window.location.href = `/dashboard/unit/${unit.id}`}
                >
                  {unit.isLocked ? (
                    "Complete previous units to unlock"
                  ) : unit.progress === 0 ? (
                    <>Start Learning <ChevronRight className="h-4 w-4 ml-1" /></>
                  ) : unit.progress === 100 ? (
                    <>Review Unit <ChevronRight className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>Continue Learning <ChevronRight className="h-4 w-4 ml-1" /></>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredUnits.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No units found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
}