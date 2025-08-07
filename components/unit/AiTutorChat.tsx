'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw, BookOpen, Brain, Lightbulb, HelpCircle, Mic, Image, Paperclip, Plus, Clock, MessageSquare, Edit3, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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

interface Chat {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  messageCount: number
}

interface AiTutorChatProps {
  unitId?: string
  selectedText?: string
}

export function AiTutorChat({ unitId, selectedText }: AiTutorChatProps) {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Risk Management Fundamentals',
      lastMessage: 'Can you explain the key principles...',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      messageCount: 12
    },
    {
      id: '2',
      title: 'CRMA Exam Strategy',
      lastMessage: 'What are the best study techniques...',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      messageCount: 8
    },
    {
      id: '3',
      title: 'Risk Assessment Methods',
      lastMessage: 'How do I perform a comprehensive...',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      messageCount: 15
    }
  ])
  const [activeChat, setActiveChat] = useState<string>('1')
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm Maia, your AI tutor for CRMA exam preparation. I'm here to help you understand complex risk management concepts, practice exam questions, and develop effective study strategies. What would you like to explore today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const quickActions: QuickAction[] = [
    {
      id: 'explain',
      icon: <Brain className="h-5 w-5" />,
      label: 'Explain a concept',
      prompt: 'Can you explain this concept in detail with examples?',
      color: 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700'
    },
    {
      id: 'summarize',
      icon: <BookOpen className="h-5 w-5" />,
      label: 'Summarize topic',
      prompt: 'Can you provide a comprehensive summary of this topic?',
      color: 'border-green-200 bg-green-50 hover:bg-green-100 text-green-700'
    },
    {
      id: 'examples',
      icon: <Lightbulb className="h-5 w-5" />,
      label: 'Give examples',
      prompt: 'Can you provide practical examples and case studies?',
      color: 'border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700'
    },
    {
      id: 'quiz',
      icon: <HelpCircle className="h-5 w-5" />,
      label: 'Test my knowledge',
      prompt: 'Create a practice quiz to test my understanding of this topic',
      color: 'border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700'
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
      textareaRef.current?.focus()
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
    textareaRef.current?.focus()
  }

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      lastMessage: '',
      timestamp: new Date(),
      messageCount: 0
    }
    setChats(prev => [newChat, ...prev])
    setActiveChat(newChat.id)
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: "Hello! I'm Maia, your AI tutor for CRMA exam preparation. I'm here to help you understand complex risk management concepts, practice exam questions, and develop effective study strategies. What would you like to explore today?",
        timestamp: new Date()
      }
    ])
  }

  const selectChat = (chatId: string) => {
    setActiveChat(chatId)
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: `Welcome back to your chat: "${chats.find(c => c.id === chatId)?.title}". What would you like to continue discussing?`,
        timestamp: new Date()
      }
    ])
  }

  const deleteChat = (chatId: string) => {
    if (chats.length === 1) return
    setChats(prev => prev.filter(chat => chat.id !== chatId))
    if (activeChat === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId)
      if (remainingChats.length > 0) {
        setActiveChat(remainingChats[0].id)
      }
    }
  }

  const renameChat = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ))
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
    if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`
    } else {
      const diffDays = diffHours / 24
      return `${Math.floor(diffDays)}d ago`
    }
  }

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getCurrentChat = () => chats.find(chat => chat.id === activeChat)

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // You could add a toast notification here
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 overflow-hidden">
      {/* Left Sidebar - Chat History */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white/80 backdrop-blur-sm border-r border-slate-200/50 flex flex-col shadow-lg transition-all duration-300`}>
        {/* Chat History Header */}
        <div className="p-4 border-b border-slate-200/50">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} mb-4`}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Chat History</h2>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {!sidebarCollapsed && (
                <button
                  onClick={createNewChat}
                  className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
              
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-hidden">
          {!sidebarCollapsed ? (
            <ScrollArea className="h-full p-4">
              <div className="space-y-3">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group relative p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                      activeChat === chat.id
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                        : "bg-white/50 border-slate-200 hover:bg-white/80"
                    }`}
                  >
                    <div onClick={() => selectChat(chat.id)} className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-slate-800 truncate text-sm pr-2">
                          {chat.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(chat.timestamp)}
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-500 truncate mb-2">
                        {chat.lastMessage || "No messages yet"}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <MessageSquare className="h-3 w-3" />
                          {chat.messageCount} messages
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const newTitle = prompt("Rename chat:", chat.title)
                              if (newTitle) renameChat(chat.id, newTitle)
                            }}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-700"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm("Delete this chat?")) deleteChat(chat.id)
                            }}
                            className="p-1 hover:bg-red-100 rounded text-slate-500 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            /* Collapsed sidebar - show only icons */
            <div className="p-2 space-y-2">
              {sidebarCollapsed && (
                <button
                  onClick={createNewChat}
                  className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  title="New Chat"
                >
                  <Plus className="h-4 w-4 mx-auto" />
                </button>
              )}
              
              {chats.slice(0, 8).map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className={`w-full p-3 rounded-lg transition-all duration-200 ${
                    activeChat === chat.id
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  title={chat.title}
                >
                  <MessageSquare className={`h-4 w-4 mx-auto ${
                    activeChat === chat.id ? 'text-blue-600' : 'text-slate-500'
                  }`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white/50 backdrop-blur-sm">
        {/* Welcome Section */}
        {messages.length <= 1 && (
          <div className="flex-1 flex flex-col justify-center items-center p-8 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">How can I help you today?</h1>
              <p className="text-slate-600 max-w-2xl">
                Hello! I'm Maia, your AI tutor for CRMA exam preparation. I'm here to help you understand complex 
                risk management concepts, practice exam questions, and develop effective study strategies.
              </p>
            </div>

            <div className="w-full max-w-4xl">
              {/* AI Message */}
              <div className="flex justify-start mb-6">
                <div className="flex gap-4 max-w-2xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200 p-4 rounded-2xl shadow-sm">
                    <p className="text-slate-800 leading-relaxed">
                      {messages[0]?.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages for active conversations */}
        {messages.length > 1 && (
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  
                  <div className={`group max-w-3xl ${message.type === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`p-4 rounded-2xl shadow-sm border ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-auto'
                          : 'bg-white/80 backdrop-blur-sm border-slate-200 text-slate-800'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">
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
                            className="h-7 w-7 p-0 hover:bg-slate-200"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-slate-200 text-green-600"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-slate-200 text-red-600"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm text-slate-500">Maia is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}

        {/* Input Area */}
        <div className="border-t border-slate-200/50 p-4 bg-white/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="flex items-end gap-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-3 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
                <Textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value)
                    adjustTextareaHeight()
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Maia anything about CRMA preparation..."
                  className="flex-1 min-h-[24px] max-h-[120px] border-none bg-transparent resize-none focus:ring-0 focus:outline-none"
                  disabled={isTyping}
                  rows={1}
                />
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-slate-200"
                  >
                    <Paperclip className="h-4 w-4 text-slate-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-slate-200"
                  >
                    <Mic className="h-4 w-4 text-slate-500" />
                  </Button>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-4 h-10 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
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
        </div>
      </div>

    </div>
  )
}