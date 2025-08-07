"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  Brain,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Paperclip,
  Mic,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "./AiTutorPage";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  chatTitle: string;
}

interface QuickPrompt {
  id: string;
  icon: React.ReactNode;
  label: string;
  prompt: string;
  color: string;
}

export function ChatInterface({
  messages,
  onSendMessage,
  chatTitle,
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickPrompts: QuickPrompt[] = [
    {
      id: "explain",
      icon: <Brain className="h-5 w-5" />,
      label: "Explain a concept",
      prompt: "Can you explain this concept in detail with examples?",
      color: "border-blue-200 hover:bg-blue-50 text-blue-700",
    },
    {
      id: "summarize",
      icon: <BookOpen className="h-5 w-5" />,
      label: "Summarize topic",
      prompt: "Can you provide a comprehensive summary of this topic?",
      color: "border-green-200 hover:bg-green-50 text-green-700",
    },
    {
      id: "examples",
      icon: <Lightbulb className="h-5 w-5" />,
      label: "Give examples",
      prompt: "Can you provide practical examples and case studies?",
      color: "border-amber-200 hover:bg-amber-50 text-amber-700",
    },
    {
      id: "quiz",
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Test my knowledge",
      prompt: "Create a practice quiz to test my understanding of this topic",
      color: "border-purple-200 hover:bg-purple-50 text-purple-700",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if AI is typing based on last message timing
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.type === "user") {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    onSendMessage(inputMessage.trim());
    setInputMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickPrompt = (prompt: QuickPrompt) => {
    setInputMessage(prompt.prompt);
    textareaRef.current?.focus();
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // Could add toast notification here
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">


      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-transparent to-slate-50/30">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Quick Prompts - Show only if no messages yet or just welcome message */}
          {messages.length <= 1 && (
            <div className="mb-4">
              <div className="text-center mb-3">
                <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center justify-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  How can I help you today?
                </h2>
                <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                  Choose a quick prompt below or ask me anything about CRMA exam preparation.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleQuickPrompt(prompt)}
                    className={`p-2 rounded-lg border transition-all duration-300 hover:scale-[1.02] hover:shadow-md text-left bg-white/50 backdrop-blur-sm ${prompt.color}`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <div className="p-1 rounded bg-white/80">
                        {prompt.icon}
                      </div>
                      <span className="font-medium text-xs">{prompt.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 sm:gap-6 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "ai" && (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}

              <div
                className={`group max-w-3xl ${
                  message.type === "user" ? "order-first" : ""
                }`}
              >
                <div
                  className={`p-4 rounded-2xl shadow-lg border ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-auto shadow-blue-200"
                      : "bg-white/80 backdrop-blur-sm border-slate-200 text-slate-800 shadow-slate-200"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-slate-500">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {message.type === "ai" && (
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

              {message.type === "user" && (
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 sm:gap-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-500">
                    Maia is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-slate-200/50 p-4 bg-gradient-to-r from-blue-50/30 to-purple-50/30 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="flex items-end gap-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-lg">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  adjustTextareaHeight();
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
                  <Image className="h-4 w-4 text-slate-500" />
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
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-6 h-12 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 font-medium"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <div className="flex items-center gap-3">
                <button className="hover:text-slate-700 transition-colors">
                  Privacy Policy
                </button>
                <button className="hover:text-slate-700 transition-colors">
                  Terms
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
