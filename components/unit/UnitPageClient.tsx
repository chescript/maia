'use client'

import { useState } from 'react'
import { TopBar } from '@/components/unit/TopBar'
import { TabsContainer } from '@/components/unit/TabsContainer'
import { AiTutorSidebar } from '@/components/unit/AiTutorSidebar'

interface UnitPageClientProps {
  unitId: string
}

export function UnitPageClient({ unitId }: UnitPageClientProps) {
  const [selectedText, setSelectedText] = useState<string>('')
  const [smartMode, setSmartMode] = useState(false)

  // Mock unit progress - in real app, this would come from API/database
  const unitProgress = 65

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim())
    }
  }

  return (
    <div className="min-h-screen bg-background" onMouseUp={handleTextSelection}>
      {/* Top Bar with Breadcrumb and Progress */}
      <TopBar 
        unitId={unitId} 
        unitProgress={unitProgress}
        smartMode={smartMode}
        onSmartModeToggle={setSmartMode}
      />
      
      {/* Main Content Layout */}
      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 pr-80"> {/* Right padding for sidebar */}
          <TabsContainer unitId={unitId} />
        </div>
        
        {/* AI Tutor Sidebar */}
        <div className="fixed right-0 top-0 h-full">
          <AiTutorSidebar 
            unitId={unitId}
            unitProgress={unitProgress}
            selectedText={selectedText}
            onTextExplanation={(text) => setSelectedText(text)}
          />
        </div>
      </div>
    </div>
  )
}