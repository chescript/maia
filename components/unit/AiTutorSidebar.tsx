'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send, Minimize2, Maximize2, X, BookOpen, Brain, Target, HelpCircle, Lightbulb, Clock, User, Bot, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

interface AiTutorSidebarProps {
  unitId: string
  unitProgress: number
  selectedText: string
  onTextExplanation: (text: string) => void
  onClose?: () => void
}

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface QuickPrompt {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  prompt: string
  category: 'explain' | 'summarize' | 'tips' | 'quiz'
}

export function AiTutorSidebar({ unitId, unitProgress, selectedText, onTextExplanation, onClose }: AiTutorSidebarProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m Maia, your AI tutor. I\'m here to help you understand this unit better. You can ask me questions, request explanations, or use the quick prompts below!',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [smartModeActive, setSmartModeActive] = useState(false)

  const quickPrompts: QuickPrompt[] = [
    {
      id: 'explain',
      icon: <BookOpen className="h-4 w-4" />,
      title: 'Explain Section',
      description: 'Get simplified explanations',
      prompt: 'Explain this section in simpler terms with examples',
      category: 'explain'
    },
    {
      id: 'summarize',
      icon: <Brain className="h-4 w-4" />,
      title: 'Summarize Unit',
      description: '5 key points summary',
      prompt: 'Summarize this unit in 5 key points',
      category: 'summarize'
    },
    {
      id: 'tips',
      icon: <Lightbulb className="h-4 w-4" />,
      title: 'Personalized Tips',
      description: 'Study strategies for you',
      prompt: 'Give me personalized study tips based on my progress',
      category: 'tips'
    },
    {
      id: 'quiz',
      icon: <Target className="h-4 w-4" />,
      title: 'Quiz Me',
      description: 'Exam-style questions',
      prompt: 'Quiz me like I\'m in an exam with 3 questions',
      category: 'quiz'
    }
  ]

  // Handle selected text explanation
  useEffect(() => {
    if (selectedText && selectedText.trim()) {
      handleQuickPrompt(`Explain this text in simpler terms: "${selectedText}"`)
    }
  }, [selectedText])

  const simulateAiResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('explain') && selectedText) {
      return `Great question! Let me break down "${selectedText}" for you:\n\n🔍 **Simple Explanation:**\nThis concept refers to the fundamental principle of measuring and managing potential losses in financial portfolios.\n\n💡 **Real-world Example:**\nThink of it like checking the weather forecast before going out - you want to know the chance of rain (risk) so you can decide whether to bring an umbrella (risk management strategy).\n\n📚 **Key Takeaway:**\nUnderstanding this helps you make better decisions about investment risks and protective measures.`
    }
    
    if (message.includes('summarize') || message.includes('5 key points')) {
      return `Here are the 5 key points for this unit:\n\n1️⃣ **Risk Identification**: Learn to spot different types of financial risks\n2️⃣ **Risk Measurement**: Use quantitative methods like VaR to measure risk\n3️⃣ **Risk Assessment**: Evaluate the impact and likelihood of risks\n4️⃣ **Risk Treatment**: Choose appropriate strategies (avoid, reduce, transfer, accept)\n5️⃣ **Risk Monitoring**: Continuously track and review risk exposures\n\n🎯 **Focus Area**: Based on your progress, spend extra time on risk measurement techniques.`
    }
    
    if (message.includes('tips') || message.includes('study')) {
      return `Based on your ${unitProgress}% progress, here are personalized study tips:\n\n📈 **Your Strengths:**\n• Good grasp of basic risk concepts\n• Strong performance in theoretical questions\n\n🎯 **Areas to Focus:**\n• Practice more VaR calculations\n• Review Basel III requirements\n• Work on case study applications\n\n⏰ **Recommended Schedule:**\n• 30 min daily review\n• 2 practice tests this week\n• Focus on weak areas identified in your last quiz\n\n💡 **Study Hack:** Use the flashcards feature for quick concept reviews during breaks!`
    }
    
    if (message.includes('quiz') || message.includes('exam')) {
      return `Let\'s test your knowledge! Here are 3 exam-style questions:\n\n**Question 1:** What is the main purpose of stress testing in risk management?\na) To increase portfolio returns\nb) To assess portfolio performance under adverse conditions\nc) To reduce transaction costs\nd) To improve market liquidity\n\n**Question 2:** Which Basel III requirement focuses on short-term liquidity?\na) Leverage Ratio\nb) LCR (Liquidity Coverage Ratio)\nc) NSFR (Net Stable Funding Ratio)\nd) Capital Conservation Buffer\n\n**Question 3:** In a normal distribution, what percentage of values fall within 2 standard deviations?\na) 68%\nb) 95%\nc) 99%\nd) 99.7%\n\n💭 Think about your answers, then let me know and I\'ll provide explanations!`
    }
    
    if (message.includes('help') || message.includes('stuck')) {
      return `I\'m here to help! Here\'s what I can do for you:\n\n🔍 **Explanations**: Select any text and I\'ll explain it simply\n📝 **Summaries**: Get key points from any section\n💡 **Study Tips**: Personalized advice based on your progress\n🎯 **Practice**: Quiz questions and exam preparation\n📊 **Progress**: Track your learning journey\n\nJust ask me anything or use the quick prompt buttons below!`
    }
    
    // Default response
    return `I understand you\'re asking about "${userMessage}". Let me help you with that!\n\nBased on the current unit content, this relates to fundamental risk management principles. Would you like me to:\n\n• Provide a detailed explanation\n• Give you practice questions\n• Suggest study strategies\n• Connect this to real-world examples\n\nJust let me know what would be most helpful!`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: simulateAiResponse(inputMessage),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt)
    handleSendMessage()
  }

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />
      
      // Handle bold text
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <div key={index} className="mb-1">
            {parts.map((part, partIndex) => 
              partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
            )}
          </div>
        )
      }
      
      return <div key={index} className="mb-1">{line}</div>
    })
  }

  if (isMinimized) {
    return (
      <div className="fixed right-4 bottom-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-80 h-full bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm border-l border-slate-200/50 shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/50 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Maia AI Tutor</h3>
              <p className="text-xs text-slate-500 font-medium">Your learning companion</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-blue-50"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-600" /> : <ChevronDown className="h-4 w-4 text-slate-600" />}
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="xl:hidden hover:bg-blue-50"
              >
                <X className="h-4 w-4 text-slate-600" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="hidden xl:block hover:bg-blue-50"
            >
              <Minimize2 className="h-4 w-4 text-slate-600" />
            </Button>
          </div>
        </div>
        
        {/* Unit Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Unit Progress</span>
            <span className="font-medium text-gray-900">{unitProgress}%</span>
          </div>
          <Progress value={unitProgress} className="h-2" />
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Quick Prompts */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickPrompts.map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  className="h-auto p-2 flex flex-col items-center gap-1 text-xs"
                >
                  {prompt.icon}
                  <span className="font-medium">{prompt.title}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="p-1 bg-blue-100 rounded-full flex-shrink-0">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {formatMessageContent(message.content)}
                    <div className={`text-xs mt-1 opacity-70`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="p-1 bg-gray-100 rounded-full flex-shrink-0">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="p-1 bg-blue-100 rounded-full flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Maia anything..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {selectedText && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <div className="font-medium text-yellow-800 mb-1">Selected Text:</div>
                <div className="text-yellow-700 truncate">"{selectedText}"</div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 h-6 text-xs"
                  onClick={() => handleQuickPrompt(`Explain this text: "${selectedText}"`)}
                >
                  Explain This
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}