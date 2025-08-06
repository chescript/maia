'use client'

import { useState } from 'react'
import { Home, ChevronRight } from 'lucide-react'

interface UnitPageHeaderProps {
  unitTitle: string
  unitProgress: number
  onSmartModeToggle?: (enabled: boolean) => void
}

export function UnitPageHeader({ unitTitle, unitProgress, onSmartModeToggle }: UnitPageHeaderProps) {
  const [smartMode, setSmartMode] = useState(false)

  const handleSmartModeToggle = () => {
    const newMode = !smartMode
    setSmartMode(newMode)
    onSmartModeToggle?.(newMode)
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-slate-600 overflow-x-auto">
        <Home className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 flex-shrink-0" />
        <a href="/dashboard" className="text-blue-600 hover:text-blue-700 transition-colors font-medium whitespace-nowrap">
          Dashboard
        </a>
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 flex-shrink-0" />
        <span className="text-slate-800 font-medium truncate">{unitTitle}</span>
      </div>

      {/* Unit Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">{unitTitle}</h1>
      </div>

      {/* Smart Mode Banner */}
      {smartMode && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium flex items-center space-x-2 rounded-xl">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0"></div>
          <span className="flex-1">🧠 Smart Mode Active: Maia will proactively engage you with questions to reinforce understanding</span>
          <button 
            onClick={handleSmartModeToggle}
            className="text-white/80 hover:text-white text-xs underline flex-shrink-0"
          >
            Turn off
          </button>
        </div>
      )}

      {/* Unit Progress Bar */}
      <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 px-4 sm:px-6 py-4 sm:py-5 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-sm sm:text-base text-slate-700 font-medium">Progress: {unitProgress}% Complete</div>
            <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm rounded-full font-medium border border-blue-200">
              8/12 Lessons
            </div>
          </div>
          <button 
            onClick={handleSmartModeToggle}
            className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 self-start sm:self-auto ${
              smartMode 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            {smartMode ? 'Smart Mode ON' : 'Enable Smart Mode'}
          </button>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 shadow-sm"
            style={{ width: `${unitProgress}%` }}
          />
        </div>
      </div>
    </div>
  )
}