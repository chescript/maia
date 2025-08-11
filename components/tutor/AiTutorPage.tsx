"use client";

import { useState } from "react";
import { ChatInterface } from "./ChatInterface";
import {
  History,
  Plus,
  MessageSquare,
  Clock,
  Trash2,
  Edit3,
} from "lucide-react";

export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export function AiTutorPage() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "Risk Management Fundamentals",
      lastMessage: "Can you explain the key principles of risk governance?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      messageCount: 12,
    },
    {
      id: "2",
      title: "CRMA Exam Strategy",
      lastMessage: "What are the best study techniques for the CRMA exam?",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      messageCount: 8,
    },
    {
      id: "3",
      title: "Risk Assessment Methods",
      lastMessage: "How do I perform a comprehensive risk assessment?",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      messageCount: 15,
    },
  ]);

  const [activeChat, setActiveChat] = useState<string>("1");
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm Maia, your AI tutor for CRMA exam preparation. I'm here to help you understand complex risk management concepts, practice exam questions, and develop effective study strategies. What would you like to explore today?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      lastMessage: "",
      timestamp: new Date(),
      messageCount: 0,
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat.id);
    setMessages([
      {
        id: "1",
        type: "ai",
        content:
          "Hello! I'm Maia, your AI tutor for CRMA exam preparation. I'm here to help you understand complex risk management concepts, practice exam questions, and develop effective study strategies. What would you like to explore today?",
        timestamp: new Date(),
      },
    ]);
    setShowChatHistory(false);
  };

  const selectChat = (chatId: string) => {
    setActiveChat(chatId);
    // In a real app, you'd load messages for this chat from an API
    // For now, we'll just clear messages except for the welcome message
    setMessages([
      {
        id: "1",
        type: "ai",
        content: `Welcome back to your chat: "${
          chats.find((c) => c.id === chatId)?.title
        }". What would you like to continue discussing?`,
        timestamp: new Date(),
      },
    ]);
    setShowChatHistory(false);
  };

  const deleteChat = (chatId: string) => {
    if (chats.length === 1) return; // Don't delete the last chat

    setChats((prev) => prev.filter((chat) => chat.id !== chatId));

    // If we deleted the active chat, switch to the first remaining chat
    if (activeChat === chatId) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setActiveChat(remainingChats[0].id);
      }
    }
  };

  const renameChat = (chatId: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const sendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Update chat with last message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              lastMessage: content,
              timestamp: new Date(),
              messageCount: chat.messageCount + 1,
              title:
                chat.title === "New Chat"
                  ? content.slice(0, 50) + "..."
                  : chat.title,
            }
          : chat
      )
    );

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getAiResponse(content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Update chat count
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? { ...chat, messageCount: chat.messageCount + 1 }
            : chat
        )
      );
    }, 1000 + Math.random() * 2000);
  };

  const getAiResponse = (userInput: string): string => {
    const responses = [
      "That's an excellent question about risk management! Let me break this down for you step by step...",
      "Great point! This concept is fundamental to understanding CRMA principles. Here's what you need to know...",
      "I can see you're thinking deeply about this topic. Let me provide a comprehensive explanation...",
      "This is a common area where students need clarification. Let me explain it in detail...",
      "Perfect! You're asking the right questions for CRMA success. Here's the key information...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getCurrentChat = () => chats.find((chat) => chat.id === activeChat);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      return "Just now";
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] sm:h-[calc(100vh-9rem)] md:h-[calc(100vh-10rem)] flex flex-col lg:flex-row gap-4 p-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 overflow-hidden">
      {/* Sidebar - Chat History */}
      <div className="lg:w-56 flex-shrink-0">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <History className="h-5 w-5 text-blue-500" />
                Chat History
              </h2>
              <button
                onClick={createNewChat}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {chats.length}
                </div>
                <div className="text-xs text-blue-600/70">Total Chats</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {chats.reduce((sum, chat) => sum + chat.messageCount, 0)}
                </div>
                <div className="text-xs text-purple-600/70">Messages</div>
              </div>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-hidden">
            <div className="p-4 h-full">
              <div className="space-y-3 h-full overflow-y-auto">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      activeChat === chat.id
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-sm"
                        : "bg-white/50 border-slate-200 hover:bg-white/80"
                    }`}
                  >
                    <div onClick={() => selectChat(chat.id)} className="flex-1">
                      <div className="flex items-start justify-between mb-2">
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
                              e.stopPropagation();
                              const newTitle = prompt(
                                "Rename chat:",
                                chat.title
                              );
                              if (newTitle) renameChat(chat.id, newTitle);
                            }}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-700"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Delete this chat?"))
                                deleteChat(chat.id);
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 min-w-0 min-h-0">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 h-full flex flex-col overflow-hidden">
          <ChatInterface
            messages={messages}
            onSendMessage={sendMessage}
            chatTitle={getCurrentChat()?.title || "New Chat"}
          />
        </div>
      </div>
    </div>
  );
}
