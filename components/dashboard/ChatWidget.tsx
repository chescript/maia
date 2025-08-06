"use client";

import { useState } from "react";
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";
import { AiTutorChat } from "@/components/unit/AiTutorChat";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center text-white z-50 group"
      >
        <MessageCircle className="h-8 w-8 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-xs font-bold text-white">!</span>
        </div>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-slate-200/50 transition-all duration-300 z-50 overflow-hidden ${
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
        <div className="flex items-center space-x-3">
          {!isMinimized && (
            <div>
              <h3 className="font-semibold">Maia AI Tutor</h3>
              <p className="text-xs text-white/80">Dashboard Assistant</p>
            </div>
          )}
          {isMinimized && (
            <span className="font-semibold">Maia AI Tutor</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4 text-white" />
            ) : (
              <Minimize2 className="h-4 w-4 text-white" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="h-[calc(100%-4rem)]">
          <AiTutorChat />
        </div>
      )}
    </div>
  );
}