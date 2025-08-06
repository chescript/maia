'use client'

import { Brain, Lightbulb, Clock, Target, BookOpen, Zap, Users, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface RetentionTipsProps {
  unitId: string
}

interface RetentionTip {
  id: string
  type: 'mnemonic' | 'analogy' | 'visualization' | 'practice' | 'connection' | 'repetition'
  title: string
  description: string
  example?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export function RetentionTips({ unitId }: RetentionTipsProps) {
  // Mock retention tips data
  const retentionTips: RetentionTip[] = [
    {
      id: '1',
      type: 'mnemonic',
      title: 'Remember the Four Risk Types',
      description: 'Use the acronym "MCOL" to remember Market, Credit, Operational, and Liquidity risks.',
      example: '"My Cat Only Laughs" - Market, Credit, Operational, Liquidity',
      difficulty: 'beginner'
    },
    {
      id: '2',
      type: 'analogy',
      title: 'VaR as a Weather Forecast',
      description: 'Think of VaR like a weather forecast: "There\'s a 95% chance it won\'t rain more than 2 inches tomorrow." VaR says "There\'s a 95% chance we won\'t lose more than $X tomorrow."',
      difficulty: 'intermediate'
    },
    {
      id: '3',
      type: 'visualization',
      title: 'Risk Treatment as Traffic Lights',
      description: 'Visualize risk treatment strategies using traffic lights: Red (Avoid), Yellow (Reduce), Green (Accept), Blue (Transfer).',
      example: 'Red = Stop/Avoid the risk entirely, Yellow = Slow down/Reduce the risk, Green = Go/Accept the risk, Blue = Detour/Transfer to someone else',
      difficulty: 'beginner'
    },
    {
      id: '4',
      type: 'practice',
      title: 'Daily Risk Spotting',
      description: 'Practice identifying risks in everyday situations. When you see news about market volatility, ask: "What type of risk is this? How would I measure it?"',
      difficulty: 'intermediate'
    },
    {
      id: '5',
      type: 'connection',
      title: 'Link Basel III to Personal Finance',
      description: 'Connect Basel III capital requirements to personal emergency funds. Just as banks need capital buffers, individuals need emergency savings.',
      example: 'Bank needs 8% capital ratio = You need 3-6 months emergency fund',
      difficulty: 'advanced'
    },
    {
      id: '6',
      type: 'repetition',
      title: 'Spaced Repetition Schedule',
      description: 'Review key formulas using spaced intervals: Day 1, Day 3, Day 7, Day 14, Day 30. This optimizes long-term retention.',
      difficulty: 'intermediate'
    },
    {
      id: '7',
      type: 'mnemonic',
      title: 'Risk Assessment Steps',
      description: 'Remember the risk assessment process with "I Am Eating Tacos": Identify, Analyze, Evaluate, Treat.',
      example: 'I Am Eating Tacos = Identify → Analyze → Evaluate → Treat',
      difficulty: 'beginner'
    },
    {
      id: '8',
      type: 'visualization',
      title: 'Diversification as Eggs in Baskets',
      description: 'Visualize portfolio diversification as not putting all eggs in one basket. Different baskets = different asset classes.',
      difficulty: 'beginner'
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mnemonic': return Brain
      case 'analogy': return Lightbulb
      case 'visualization': return Target
      case 'practice': return RefreshCw
      case 'connection': return Users
      case 'repetition': return Clock
      default: return BookOpen
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mnemonic': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'analogy': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'visualization': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'practice': return 'bg-green-100 text-green-800 border-green-200'
      case 'connection': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'repetition': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTypeName = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  // Group tips by type
  const groupedTips = retentionTips.reduce((acc, tip) => {
    if (!acc[tip.type]) {
      acc[tip.type] = []
    }
    acc[tip.type].push(tip)
    return acc
  }, {} as Record<string, RetentionTip[]>)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Retention Tips</h2>
        <p className="text-sm text-gray-600">
          Memory aids, mnemonics, and study strategies to help you remember key concepts
        </p>
      </div>

      {/* Study Strategy Overview */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Zap className="h-5 w-5" />
            Personalized Study Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">Visual</div>
              <div className="text-sm text-blue-700">Your learning style</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">85%</div>
              <div className="text-sm text-purple-700">Retention rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">12</div>
              <div className="text-sm text-green-700">Days until exam</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips by Category */}
      <div className="space-y-8">
        {Object.entries(groupedTips).map(([type, tips]) => {
          const Icon = getTypeIcon(type)
          return (
            <div key={type}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon className="h-5 w-5 text-gray-600" />
                {formatTypeName(type)} Techniques
              </h3>
              
              <div className="grid gap-4">
                {tips.map((tip) => (
                  <Card key={tip.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 flex-1">{tip.title}</h4>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge className={getTypeColor(tip.type)}>
                            {formatTypeName(tip.type)}
                          </Badge>
                          <Badge className={getDifficultyColor(tip.difficulty)}>
                            {tip.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-3">
                        {tip.description}
                      </p>
                      
                      {tip.example && (
                        <>
                          <Separator className="my-3" />
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-xs font-medium text-gray-600 mb-1">Example:</div>
                            <div className="text-sm text-gray-800 font-mono">{tip.example}</div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Study Schedule Recommendation */}
      <Card className="mt-8 bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Clock className="h-5 w-5" />
            Recommended Study Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <div className="font-medium text-gray-900">Today</div>
                <div className="text-sm text-gray-600">Review mnemonics and analogies</div>
              </div>
              <Badge className="bg-green-100 text-green-800">30 min</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <div className="font-medium text-gray-900">Day 3</div>
                <div className="text-sm text-gray-600">Practice visualization techniques</div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">25 min</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <div className="font-medium text-gray-900">Day 7</div>
                <div className="text-sm text-gray-600">Test retention with practice exercises</div>
              </div>
              <Badge className="bg-purple-100 text-purple-800">45 min</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="mt-8 bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Pro Tips for Better Retention</h4>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• Create your own mnemonics - they\'re more memorable when you make them</li>
                <li>• Use multiple techniques together for complex concepts</li>
                <li>• Practice active recall instead of just re-reading</li>
                <li>• Connect new concepts to things you already know well</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}