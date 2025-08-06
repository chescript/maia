"use client";

import { useState } from "react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatInterface } from "./ChatInterface";
import { Menu, X } from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    setSidebarOpen(false);
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
    setSidebarOpen(false);
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

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 rounded-lg overflow-hidden">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-[60] p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition-colors lg:hidden"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-[55] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chat Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-[60] w-80 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto lg:inset-y-auto lg:h-full
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${!sidebarOpen ? "lg:w-0 lg:overflow-hidden" : "lg:w-80"}
      `}
      >
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onNewChat={createNewChat}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          onRenameChat={renameChat}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Desktop Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden lg:flex absolute top-4 left-4 z-[60] p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition-all duration-300"
        style={{
          transform: sidebarOpen ? "translateX(320px)" : "translateX(0)",
        }}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatInterface
          messages={messages}
          onSendMessage={sendMessage}
          chatTitle={getCurrentChat()?.title || "New Chat"}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
    </div>
  );
}
