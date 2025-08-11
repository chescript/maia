"use client";

import { useState, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Sparkles,
  BarChart3,
  TrendingUp,
  Clock,
  HelpCircle,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quickSuggestions] = useState([
    {
      text: "Tell me about my CRMA readiness score",
      icon: <BarChart3 className="h-3 w-3" />,
    },
    {
      text: "Where do I need to improve?",
      icon: <TrendingUp className="h-3 w-3" />,
    },
    {
      text: "Where should I focus my time today?",
      icon: <Clock className="h-3 w-3" />,
    },
    {
      text: "Generate a custom quiz based on my weak areas",
      icon: <HelpCircle className="h-3 w-3" />,
    },
  ]);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Mobile popup button when closed
  if (!isDesktop && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full shadow-xl transition-all duration-200 flex items-center justify-center text-white z-50 hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  // Desktop sidebar or mobile popup
  return (
    <div
      className={`
      ${
        isDesktop
          ? "h-full w-full bg-white/80 backdrop-blur-sm border-l border-slate-200/50 shadow-lg"
          : "fixed bottom-6 right-6 w-80 h-[500px] bg-white rounded-2xl shadow-xl border border-slate-200 z-50"
      } 
      flex flex-col
    `}
    >
      {!isDesktop && (
        <div className="flex justify-end p-2">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      )}

      {/* Greeting Message */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 mb-1">
                Hi, Maia here, your study buddy!
              </p>
              <p className="text-sm text-slate-600">
                How can I make your life easier today?
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="space-y-1">
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setMessage(suggestion.text)}
              className="w-full text-left p-2 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg text-xs text-slate-700 hover:text-slate-800 transition-all duration-200 border border-slate-200 hover:border-blue-300 hover:shadow-sm flex items-center gap-2"
            >
              <div className="w-4 h-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center flex-shrink-0 text-blue-600">
                {suggestion.icon}
              </div>
              {suggestion.text}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 shadow-sm">
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200/50 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything about your studies..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:bg-white transition-all"
          />
          <button
            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={() => {
              if (message.trim()) {
                // Handle send message logic here
                setMessage("");
              }
            }}
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
