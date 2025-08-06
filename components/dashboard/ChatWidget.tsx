"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "maia";
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm Maia, your AI tutor. I'm here to help you with your CRMA exam preparation. How can I assist you today?",
      sender: "maia",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(message),
        sender: "maia",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("readiness") || lowerMessage.includes("score")) {
      return "Based on your current progress, you're 74% ready for the CRMA exam. Your strongest areas are Risk Governance (85%) and Risk Assessment (78%). I recommend focusing on Risk Response (60%) and Regulatory Compliance (55%) to improve your overall readiness.";
    }

    if (lowerMessage.includes("improve") || lowerMessage.includes("weak")) {
      return "Your weakest areas are: 1) Regulatory Compliance (55% accuracy) - focus on SOX requirements and audit standards, 2) Risk Response (60% accuracy) - review mitigation strategies and control design, 3) Information Systems (68% accuracy) - study IT controls and data governance.";
    }

    if (
      lowerMessage.includes("focus") ||
      lowerMessage.includes("today") ||
      lowerMessage.includes("study")
    ) {
      return "For today, I recommend spending 1-2 hours on Risk Response topics, specifically mitigation strategies. You haven't studied this area in 8 days, and it's one of your weakest topics. Would you like me to create a custom quiz on this topic?";
    }

    if (
      lowerMessage.includes("quiz") ||
      lowerMessage.includes("test") ||
      lowerMessage.includes("practice")
    ) {
      return "I can create a custom quiz for you! Based on your performance data, I suggest a 20-question quiz focusing on Risk Response and Regulatory Compliance. This should take about 30 minutes. Would you like me to generate this quiz now?";
    }

    if (lowerMessage.includes("mock exam") || lowerMessage.includes("exam")) {
      return "You've completed Mock Exam 1 with a 78% score - great job! You're ready for Mock Exam 2, which is more challenging. I recommend taking it this weekend after reviewing Risk Response topics. Mock exams are 150 questions and take 3.5 hours.";
    }

    if (lowerMessage.includes("time") || lowerMessage.includes("schedule")) {
      return "You have 45 days until your CRMA exam. Based on your current pace, you're on track! I recommend studying 8-10 hours per week, focusing on your weak areas. Your current study streak is 12 days - keep it up!";
    }

    return "I'm here to help with your CRMA exam preparation! You can ask me about your readiness score, which topics to focus on, creating custom quizzes, or any specific CRMA concepts you'd like to review. What would you like to know?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "Tell me about my readiness score",
    "Where should I focus today?",
    "Create a custom quiz",
    "When should I take Mock Exam 2?",
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
        <div className="absolute -top-12 right-0 bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm text-card-foreground whitespace-nowrap">
            Chat with Maia
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`bg-card border border-border rounded-xl shadow-xl transition-all duration-300 ${
          isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">
                Maia AI Tutor
              </h3>
              <p className="text-xs text-muted-foreground">
                Always here to help
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      msg.sender === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        msg.sender === "user" ? "bg-primary/20" : "bg-muted"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Bot className="h-3 w-3 text-primary" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-card-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Quick prompts:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(prompt)}
                      className="text-xs p-2 bg-muted hover:bg-muted/80 rounded text-left transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Maia anything about CRMA..."
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
