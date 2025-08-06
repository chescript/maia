'use client'

import { useState } from 'react'
import { Plus, MessageSquare, MoreHorizontal, Edit2, Trash2, Calendar, Hash, Bot, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Chat } from './AiTutorPage'

interface ChatSidebarProps {
  chats: Chat[]
  activeChat: string
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  onRenameChat: (chatId: string, newTitle: string) => void
  onClose?: () => void
}

export function ChatSidebar({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onClose
}: ChatSidebarProps) {
  const [editingChat, setEditingChat] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [showMenu, setShowMenu] = useState<string | null>(null)

  const handleRename = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (chat) {
      setEditingChat(chatId)
      setEditTitle(chat.title)
      setShowMenu(null)
    }
  }

  const confirmRename = () => {
    if (editingChat && editTitle.trim()) {
      onRenameChat(editingChat, editTitle.trim())
      setEditingChat(null)
      setEditTitle('')
    }
  }

  const cancelRename = () => {
    setEditingChat(null)
    setEditTitle('')
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffHours < 1) {
      return 'Just now'
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}d ago`
    } else {
      return timestamp.toLocaleDateString()
    }
  }

  const groupChatsByDate = (chats: Chat[]) => {
    const groups: { [key: string]: Chat[] } = {}
    
    chats.forEach(chat => {
      const now = new Date()
      const chatDate = chat.timestamp
      const diffHours = (now.getTime() - chatDate.getTime()) / (1000 * 60 * 60)
      
      let groupKey: string
      if (diffHours < 24) {
        groupKey = 'Today'
      } else if (diffHours < 48) {
        groupKey = 'Yesterday'
      } else if (diffHours < 168) { // 7 days
        groupKey = 'Previous 7 days'
      } else {
        groupKey = 'Older'
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(chat)
    })
    
    return groups
  }

  const chatGroups = groupChatsByDate(chats)

  return (
    <div className="h-full bg-gradient-to-b from-white to-slate-50 flex flex-col border-r border-slate-200/50 shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-800">Maia AI Tutor</h2>
              <p className="text-sm text-slate-500">Your CRMA Study Assistant</p>
            </div>
          </div>
          
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <X className="h-4 w-4 text-slate-600" />
            </Button>
          )}
        </div>
        
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl h-11 transition-all duration-200 hover:shadow-lg shadow-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {Object.entries(chatGroups).map(([groupName, groupChats]) => (
            <div key={groupName} className="mb-4">
              <h3 className="text-xs font-medium text-slate-600 uppercase tracking-wider px-2 py-2 flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {groupName}
              </h3>
              
              {groupChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative rounded-xl mb-1 transition-all duration-200 ${
                    activeChat === chat.id
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div
                    className="p-3 cursor-pointer flex items-center justify-between"
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg ${
                        activeChat === chat.id 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                          : 'bg-slate-200 group-hover:bg-slate-300'
                      } transition-colors`}>
                        <MessageSquare className={`h-4 w-4 ${
                          activeChat === chat.id ? 'text-white' : 'text-slate-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {editingChat === chat.id ? (
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={confirmRename}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') confirmRename()
                              if (e.key === 'Escape') cancelRename()
                            }}
                            className="w-full bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        ) : (
                          <>
                            <h4 className={`font-medium text-sm truncate ${
                              activeChat === chat.id ? 'text-blue-800' : 'text-slate-800'
                            }`}>
                              {chat.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs ${
                                activeChat === chat.id ? 'text-blue-600' : 'text-slate-500'
                              }`}>
                                {formatTimestamp(chat.timestamp)}
                              </span>
                              <div className={`flex items-center gap-1 text-xs ${
                                activeChat === chat.id ? 'text-blue-600' : 'text-slate-500'
                              }`}>
                                <Hash className="h-3 w-3" />
                                {chat.messageCount}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {editingChat !== chat.id && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowMenu(showMenu === chat.id ? null : chat.id)
                          }}
                          className="p-1 rounded-lg hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          <MoreHorizontal className="h-4 w-4 text-slate-600" />
                        </button>

                        {showMenu === chat.id && (
                          <div className="absolute right-0 top-8 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRename(chat.id)
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 rounded-t-lg flex items-center gap-2 text-slate-700"
                            >
                              <Edit2 className="h-4 w-4" />
                              Rename
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteChat(chat.id)
                                setShowMenu(null)
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 rounded-b-lg flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 text-center">
          <p>🧠 Powered by Maia AI</p>
          <p className="mt-1">Your personalized CRMA tutor</p>
        </div>
      </div>
    </div>
  )
}