'use client'


import { ChevronRight, Home, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface TopBarProps {
  unitId: string
  unitProgress: number
  smartMode: boolean
  onSmartModeToggle: (enabled: boolean) => void
}

export function TopBar({ unitId, unitProgress, smartMode, onSmartModeToggle }: TopBarProps) {
  // Mock data - replace with actual data fetching
  const unitData = {
    title: 'Financial Risk Management Fundamentals',
    progress: unitProgress,
    totalLessons: 12,
    completedLessons: 8
  }

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Dashboard</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 font-medium">{unitData.title}</span>
        </div>
        
        {/* Unit Title and Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{unitData.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{unitData.progress}% Complete</span>
                </div>
                <Progress value={unitData.progress} className="h-2" />
              </div>
              <Badge variant="secondary" className="text-xs">
                {unitData.completedLessons}/{unitData.totalLessons} Lessons
              </Badge>
            </div>
          </div>
          
          {/* Smart Mode Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Smart Mode</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSmartModeToggle(!smartMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                smartMode 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {smartMode ? (
                <ToggleRight className="h-5 w-5" />
              ) : (
                <ToggleLeft className="h-5 w-5" />
              )}
              <span className="text-xs font-medium">
                {smartMode ? 'Active Recall ON' : 'Standard Mode'}
              </span>
            </Button>
          </div>
        </div>
        
        {/* Smart Mode Indicator */}
        {smartMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <p className="text-sm text-blue-800">
              🧠 <strong>Smart Mode Active:</strong> Maia will proactively engage you with questions to reinforce understanding as you study.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}