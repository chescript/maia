'use client'

import { useState, useRef } from 'react'
import { MessageSquare, Highlighter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface UnitContentProps {
  unitId: string
}

export function UnitContent({ unitId }: UnitContentProps) {
  const [selectedText, setSelectedText] = useState('')
  const [showExplainButton, setShowExplainButton] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Mock content - replace with actual content fetching
  const content = `
    # Financial Risk Management Fundamentals
    
    ## Introduction to Risk Management
    
    Risk management is a critical component of financial decision-making that involves identifying, assessing, and prioritizing risks followed by coordinated application of resources to minimize, monitor, and control the probability or impact of unfortunate events.
    
    ### Types of Financial Risk
    
    **Market Risk**: The risk of losses due to changes in market prices, including equity prices, interest rates, foreign exchange rates, and commodity prices.
    
    **Credit Risk**: The possibility that a borrower or counterparty will fail to meet their obligations in accordance with agreed terms.
    
    **Operational Risk**: The risk of loss resulting from inadequate or failed internal processes, people, and systems, or from external events.
    
    **Liquidity Risk**: The risk that an entity will not be able to meet its financial obligations as they come due without incurring unacceptable losses.
    
    ### Risk Assessment Framework
    
    A comprehensive risk assessment framework typically includes:
    
    1. **Risk Identification**: Systematic identification of potential risks that could affect the organization
    2. **Risk Analysis**: Evaluation of the likelihood and impact of identified risks
    3. **Risk Evaluation**: Comparison of estimated risks against risk criteria to determine significance
    4. **Risk Treatment**: Selection and implementation of appropriate risk treatment options
    
    ### Quantitative vs Qualitative Risk Assessment
    
    **Quantitative Assessment** uses numerical methods and statistical models to measure risk. Common metrics include:
    - Value at Risk (VaR)
    - Expected Shortfall (ES)
    - Beta coefficients
    - Standard deviation
    
    **Qualitative Assessment** relies on subjective judgment and descriptive scales to evaluate risk. This approach is useful when:
    - Historical data is limited
    - Risks are difficult to quantify
    - Expert judgment is required
    
    ### Risk Mitigation Strategies
    
    Organizations can employ various strategies to manage risk:
    
    **Risk Avoidance**: Eliminating activities that create risk
    **Risk Reduction**: Implementing controls to reduce the likelihood or impact of risks
    **Risk Transfer**: Shifting risk to third parties through insurance or contracts
    **Risk Acceptance**: Acknowledging and accepting certain levels of risk
    
    ### Regulatory Framework
    
    Financial institutions must comply with various regulatory requirements, including:
    - Basel III capital requirements
    - Solvency II for insurance companies
    - Dodd-Frank Act provisions
    - MiFID II regulations
  `

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString().trim())
      setShowExplainButton(true)
    } else {
      setSelectedText('')
      setShowExplainButton(false)
    }
  }

  const handleExplainText = () => {
    // This would trigger the AI explanation in the sidebar
    console.log('Explaining text:', selectedText)
    // You can emit an event or call a function to communicate with the AI sidebar
    window.dispatchEvent(new CustomEvent('explainText', { detail: selectedText }))
  }

  return (
    <div className="p-6">
      {/* Content Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Unit Content</h2>
        <p className="text-sm text-gray-600">
          Select any text to get simplified explanations from Maia
        </p>
      </div>

      {/* Selected Text Action */}
      {showExplainButton && (
        <Card className="mb-4 p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-blue-800 mb-1">
                <Highlighter className="h-4 w-4 inline mr-1" />
                Selected text:
              </p>
              <p className="text-sm text-blue-900 font-medium italic">
                "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
              </p>
            </div>
            <Button
              onClick={handleExplainText}
              size="sm"
              className="ml-4 bg-blue-600 hover:bg-blue-700"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Explain with Maia
            </Button>
          </div>
        </Card>
      )}

      {/* Main Content */}
      <div 
        ref={contentRef}
        className="prose prose-gray max-w-none"
        onMouseUp={handleTextSelection}
        style={{ userSelect: 'text' }}
      >
        <div className="whitespace-pre-line leading-relaxed">
          {content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return <h1 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-4">{line.substring(2)}</h1>
            } else if (line.startsWith('## ')) {
              return <h2 key={index} className="text-xl font-semibold text-gray-800 mt-5 mb-3">{line.substring(3)}</h2>
            } else if (line.startsWith('### ')) {
              return <h3 key={index} className="text-lg font-medium text-gray-700 mt-4 mb-2">{line.substring(4)}</h3>
            } else if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={index} className="font-semibold text-gray-800 mt-3 mb-2">{line.slice(2, -2)}</p>
            } else if (line.trim().startsWith('-')) {
              return <li key={index} className="ml-4 text-gray-700">{line.trim().substring(1).trim()}</li>
            } else if (line.trim().match(/^\d+\./)) {
              return <li key={index} className="ml-4 text-gray-700 list-decimal">{line.trim().substring(line.indexOf('.') + 1).trim()}</li>
            } else if (line.trim()) {
              return <p key={index} className="text-gray-700 mb-3 leading-relaxed">{line}</p>
            } else {
              return <br key={index} />
            }
          })}
        </div>
      </div>
    </div>
  )
}