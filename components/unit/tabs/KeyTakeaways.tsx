'use client'

import { CheckCircle, Star, Lightbulb, Target, BookOpen, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface KeyTakeawaysProps {
  unitId: string
}

interface Takeaway {
  id: string
  category: 'concept' | 'formula' | 'example' | 'regulation' | 'best-practice' | 'exam-tip'
  title: string
  description: string
  importance: 'high' | 'medium' | 'low'
}

export function KeyTakeaways({ unitId }: KeyTakeawaysProps) {
  // Mock takeaways data
  const takeaways: Takeaway[] = [
    {
      id: '1',
      category: 'concept',
      title: 'Four Main Types of Financial Risk',
      description: 'Market Risk, Credit Risk, Operational Risk, and Liquidity Risk are the fundamental categories that every risk manager must understand and monitor.',
      importance: 'high'
    },
    {
      id: '2',
      category: 'formula',
      title: 'Value at Risk (VaR) Calculation',
      description: 'VaR = Portfolio Value × Z-score × Standard Deviation. This quantifies the maximum expected loss over a specific time period at a given confidence level.',
      importance: 'high'
    },
    {
      id: '3',
      category: 'best-practice',
      title: 'Risk Assessment Framework',
      description: 'Always follow the systematic approach: Risk Identification → Risk Analysis → Risk Evaluation → Risk Treatment. This ensures comprehensive coverage.',
      importance: 'high'
    },
    {
      id: '4',
      category: 'regulation',
      title: 'Basel III Capital Requirements',
      description: 'Financial institutions must maintain minimum capital ratios: Common Equity Tier 1 (4.5%), Tier 1 Capital (6%), and Total Capital (8%).',
      importance: 'medium'
    },
    {
      id: '5',
      category: 'example',
      title: 'Diversification Benefits',
      description: 'A portfolio with 60% stocks and 40% bonds typically has lower volatility than 100% stocks, demonstrating risk reduction through diversification.',
      importance: 'medium'
    },
    {
      id: '6',
      category: 'exam-tip',
      title: 'Qualitative vs Quantitative Assessment',
      description: 'Remember: Use quantitative when you have historical data and statistical models. Use qualitative when data is limited or expert judgment is required.',
      importance: 'high'
    },
    {
      id: '7',
      category: 'concept',
      title: 'Risk Treatment Strategies',
      description: 'The 4 As of Risk Management: Avoid (eliminate), Accept (retain), Attenuate (reduce), and Assign (transfer). Choose based on cost-benefit analysis.',
      importance: 'medium'
    },
    {
      id: '8',
      category: 'best-practice',
      title: 'Continuous Monitoring',
      description: 'Risk management is not a one-time activity. Establish regular review cycles and update risk assessments as business conditions change.',
      importance: 'medium'
    }
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'concept': return BookOpen
      case 'formula': return Target
      case 'example': return Lightbulb
      case 'regulation': return CheckCircle
      case 'best-practice': return Star
      case 'exam-tip': return TrendingUp
      default: return BookOpen
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'concept': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'formula': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'example': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'regulation': return 'bg-red-100 text-red-800 border-red-200'
      case 'best-practice': return 'bg-green-100 text-green-800 border-green-200'
      case 'exam-tip': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const formatCategoryName = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  // Group takeaways by importance
  const highImportance = takeaways.filter(t => t.importance === 'high')
  const mediumImportance = takeaways.filter(t => t.importance === 'medium')
  const lowImportance = takeaways.filter(t => t.importance === 'low')

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Key Takeaways</h2>
        <p className="text-sm text-gray-600">
          Essential concepts and insights from this unit
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center border-red-200 bg-red-50">
          <div className="text-2xl font-bold text-red-600">{highImportance.length}</div>
          <div className="text-sm text-red-700">High Priority</div>
        </Card>
        <Card className="p-4 text-center border-yellow-200 bg-yellow-50">
          <div className="text-2xl font-bold text-yellow-600">{mediumImportance.length}</div>
          <div className="text-sm text-yellow-700">Medium Priority</div>
        </Card>
        <Card className="p-4 text-center border-green-200 bg-green-50">
          <div className="text-2xl font-bold text-green-600">{lowImportance.length}</div>
          <div className="text-sm text-green-700">Low Priority</div>
        </Card>
      </div>

      {/* High Priority Takeaways */}
      {highImportance.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            High Priority Concepts
          </h3>
          <div className="space-y-4">
            {highImportance.map((takeaway) => {
              const Icon = getCategoryIcon(takeaway.category)
              return (
                <Card key={takeaway.id} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getCategoryColor(takeaway.category)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{takeaway.title}</h4>
                          <Badge variant="outline" className={getCategoryColor(takeaway.category)}>
                            {formatCategoryName(takeaway.category)}
                          </Badge>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{takeaway.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Medium Priority Takeaways */}
      {mediumImportance.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-yellow-700 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            Medium Priority Concepts
          </h3>
          <div className="space-y-4">
            {mediumImportance.map((takeaway) => {
              const Icon = getCategoryIcon(takeaway.category)
              return (
                <Card key={takeaway.id} className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getCategoryColor(takeaway.category)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{takeaway.title}</h4>
                          <Badge variant="outline" className={getCategoryColor(takeaway.category)}>
                            {formatCategoryName(takeaway.category)}
                          </Badge>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{takeaway.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Low Priority Takeaways */}
      {lowImportance.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Additional Concepts
          </h3>
          <div className="space-y-4">
            {lowImportance.map((takeaway) => {
              const Icon = getCategoryIcon(takeaway.category)
              return (
                <Card key={takeaway.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getCategoryColor(takeaway.category)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{takeaway.title}</h4>
                          <Badge variant="outline" className={getCategoryColor(takeaway.category)}>
                            {formatCategoryName(takeaway.category)}
                          </Badge>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{takeaway.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Study Tip */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Study Tip</h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                Focus on high-priority concepts first, then review medium-priority items. 
                Use these takeaways as quick reference points during your exam preparation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}