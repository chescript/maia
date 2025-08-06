'use client'

import { useState } from 'react'
import { Book, FileText, CreditCard, Star, Brain, CheckCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UnitContent } from './tabs/UnitContent'
import { MyNotes } from './tabs/MyNotes'
import { Flashcards } from './tabs/Flashcards'
import { KeyTakeaways } from './tabs/KeyTakeaways'
import { RetentionTips } from './tabs/RetentionTips'
import { UnitQuiz } from './tabs/UnitQuiz'

interface TabsContainerProps {
  unitId: string
}

export function TabsContainer({ unitId }: TabsContainerProps) {
  const [activeTab, setActiveTab] = useState('content')

  const tabs = [
    {
      id: 'content',
      label: 'Unit Content',
      icon: Book,
      component: UnitContent
    },
    {
      id: 'notes',
      label: 'My Notes',
      icon: FileText,
      component: MyNotes
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: CreditCard,
      component: Flashcards
    },
    {
      id: 'takeaways',
      label: 'Key Takeaways',
      icon: Star,
      component: KeyTakeaways
    },
    {
      id: 'retention',
      label: 'Retention Tips',
      icon: Brain,
      component: RetentionTips
    },
    {
      id: 'quiz',
      label: 'Unit Quiz',
      icon: CheckCircle,
      component: UnitQuiz
    }
  ]

  return (
    <div className="px-6 py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab Navigation */}
        <TabsList className="grid w-full grid-cols-6 mb-6 h-12">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 text-xs font-medium px-3 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Tab Content */}
        {tabs.map((tab) => {
          const Component = tab.component
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <Component unitId={unitId} />
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}