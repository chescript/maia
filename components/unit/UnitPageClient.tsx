'use client'

import { TabsContainer } from '@/components/unit/TabsContainer'
import { UnitPageHeader } from '@/components/unit/UnitPageHeader'

interface UnitPageClientProps {
  unitId: string
}

export function UnitPageClient({ unitId }: UnitPageClientProps) {
  // Mock unit progress - in real app, this would come from API/database
  const unitProgress = 65
  const unitTitle = "Financial Risk Management Fundamentals"

  return (
    <div className="space-y-6">
      <UnitPageHeader 
        unitTitle={unitTitle}
        unitProgress={unitProgress}
      />
      
      <TabsContainer unitId={unitId} />
    </div>
  )
}