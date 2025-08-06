'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw, BookOpen, Brain, Lightbulb, HelpCircle, Mic, Image, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface QuickAction {
  id: string
  icon: React.ReactNode
  label: string
  prompt: string
  color: string
}

interface AiTutorChatProps {
  unitId?: string
  selectedText?: string
}

export function AiTutorChat({ unitId, selectedText }: AiTutorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm Maia, your AI tutor. I'm here to help you master this unit. You can ask me questions, request explanations, or use the quick actions below. What would you like to learn about?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const quickActions: QuickAction[] = [
    {
      id: 'explain',
      icon: <Brain className="h-4 w-4" />,
      label: 'Explain Concept',
      prompt: 'Can you explain this concept in simple terms?',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'summarize',
      icon: <BookOpen className="h-4 w-4" />,
      label: 'Summarize',
      prompt: 'Can you summarize the key points from this section?',
      color: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      id: 'examples',
      icon: <Lightbulb className="h-4 w-4" />,
      label: 'Give Examples',
      prompt: 'Can you provide some practical examples?',
      color: 'bg-amber-500 hover:bg-amber-600'
    },
    {
      id: 'quiz',
      icon: <HelpCircle className="h-4 w-4" />,
      label: 'Test Me',
      prompt: 'Create a quick quiz to test my understanding',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedText) {
      setInputMessage(`Explain this: "${selectedText}"`)
      inputRef.current?.focus()
    }
  }, [selectedText])

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

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAiResponse(inputMessage),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getAiResponse = (userInput: string): string => {
    // Mock AI responses - in real app, this would call an API
    const responses = [
      "Great question! Let me break this down for you step by step...",
      "That's an important concept in risk management. Here's what you need to know...",
      "I can help explain that! This relates to what we covered earlier about...",
      "Excellent! You're asking the right questions. Here's a detailed explanation..."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleQuickAction = (action: QuickAction) => {
    setInputMessage(action.prompt)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // You could add a toast notification here
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Maia AI Tutor</h3>
            <p className="text-sm text-white/80 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Online & Ready to Help
            </p>
          </div>
          <div className="ml-auto">
            <Sparkles className="h-5 w-5 text-white/80" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-slate-100">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction(action)}
              className={`${action.color} text-white text-xs h-8 justify-start gap-2 hover:scale-105 transition-all duration-200`}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div className={`group max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`p-3 rounded-2xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-auto'
                      : 'bg-white border border-slate-200'
                  }`}
                >
                  <p className={`text-sm leading-relaxed ${message.type === 'ai' ? 'text-slate-800' : 'text-white'}`}>
                    {message.content}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(message.content)}
                        className="h-6 w-6 p-0 hover:bg-slate-100"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-slate-100 text-green-600"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-slate-100 text-red-600"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-xs text-slate-500 ml-2">Maia is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Maia anything about this topic..."
              className="pr-24 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-300 rounded-xl"
              disabled={isTyping}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-slate-200"
              >
                <Paperclip className="h-4 w-4 text-slate-500" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-slate-200"
              >
                <Mic className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-4 h-10 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMessages(messages.slice(0, 1))}
              className="h-6 text-xs hover:bg-slate-100"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}