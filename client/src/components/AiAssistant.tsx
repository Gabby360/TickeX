"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, User, HelpCircle, ChevronRight, Ticket, CheckCircle2 } from "lucide-react";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
};

const SUGGESTED_QUESTIONS = [
  "How do I buy event tickets?",
  "What payment methods are supported?",
  "Who founded TickeX?",
  "How do organizers scan & verify tickets?",
  "Can I host my own event on TickeX?",
  "Where do I view my purchased tickets?"
];

// Knowledge Base for TickeX Platform Assistant
const KNOWLEDGE_BASE: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["buy", "purchase", "get ticket", "pass", "how to buy"],
    answer: "To buy an event ticket:\n1. Scroll to the **Upcoming Events** section.\n2. Click **Buy Ticket** on your desired event.\n3. Complete the quick Paystack checkout via Mobile Money (MTN, Telecel, AT) or Credit/Debit Card.\n4. Your instant QR-coded ticket pass will appear immediately under **My Tickets**!"
  },
  {
    keywords: ["payment", "pay", "momo", "card", "paystack", "currency", "ghc", "cedi"],
    answer: "TickeX supports secure payments processed via Paystack. You can pay using:\n• Mobile Money (MTN MoMo, Telecel Cash, AT Money)\n• Visa / Mastercard Credit & Debit cards\nAll transactions are encrypted and processed in Ghana Cedis (GH₵)."
  },
  {
    keywords: ["founder", "gabriel", "isaac", "dennis", "creator", "team", "who built", "who founded"],
    answer: "TickeX was founded in Ghana by three visionary tech leaders:\n• **Agblevor Gabriel** — Founder & CEO, Miles Systems\n• **Isaac Darko Asante** — Founder, AfriKreate\n• **Dennis Asiedu** — Founder, StartupLens"
  },
  {
    keywords: ["verify", "scan", "validation", "entry", "gate", "qr", "qr code", "fraud"],
    answer: "TickeX provides single-use, cryptographically signed QR codes on every ticket pass. Event organizers use our real-time scanner on their smartphones to validate tickets at venue gates, eliminating duplicate or fraudulent entries."
  },
  {
    keywords: ["host", "organizer", "create event", "list event", "publish"],
    answer: "Yes! Event organizers can list events on TickeX easily. Click **For Organizers** or **Host An Event** on the navigation bar, or log in to your organizer dashboard to manage tickets, sales analytics, and attendee check-ins."
  },
  {
    keywords: ["my tickets", "view ticket", "download", "find ticket", "purchased"],
    answer: "Click the **My Tickets** button in the top navigation bar at any time! Your active digital ticket passes (complete with live QR codes and event details) will pop up instantly."
  },
  {
    keywords: ["event", "upcoming", "location", "accra", "kumasi", "movenpick", "labadi", "aicc"],
    answer: "We host top events across Ghana! Current featured events include the **AfriKreate Creative Summit** by Isaac at Mövenpick Accra, **StartupLens Tech & AI Live Podcast** by Dennis at East Legon, **Accra Synthwave & Afrobeat Fest** at AICC, and the **Ghana Premier League Derby** at Baba Yara Stadium, Kumasi."
  },
  {
    keywords: ["contact", "support", "help", "email"],
    answer: "For support, you can reach the TickeX team via email at **support@tickex.com** or click any helper options inside your attendee dashboard."
  }
];

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hello! 👋 I'm your TickeX Virtual Assistant. How can I help you today with events, ticket purchases, or hosting on TickeX?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const generateAnswer = (userQuery: string): string => {
    const q = userQuery.toLowerCase();

    // Find best match in Knowledge Base
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some(kw => q.includes(kw))) {
        return item.answer;
      }
    }

    // Default polite restriction response if query is off-topic
    return "I am the **TickeX Assistant**, specifically trained to help you with questions about the TickeX event ticketing platform, buying passes, Paystack payments, hosting events, or our founders.\n\nCould you please ask a question related to TickeX?";
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Simulate smart AI typing delay
    setTimeout(() => {
      const botResponse = generateAnswer(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-bold text-sm rounded-full shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 active:scale-95 transition-all duration-300 ring-2 ring-white/20"
          aria-label="Toggle TickeX AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#030014] animate-pulse" />
          </div>
          <span className="hidden sm:inline font-semibold">TickeX AI Helper</span>
        </button>
      </div>

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-h-[550px] h-[500px] z-50 bg-[#0b0f19]/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 ring-1 ring-white/10">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-[#111827] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  TickeX Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-400">Platform Support & Knowledge</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm selection:bg-orange-500 selection:text-white">
            
            {/* Disclaimer notice */}
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs text-center flex items-center justify-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Ask anything about events, tickets & hosting on TickeX</span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed text-xs sm:text-sm ${
                    msg.sender === "user"
                      ? "bg-orange-500 text-white rounded-br-none shadow-md"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none whitespace-pre-line"
                  }`}
                >
                  {msg.text}
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      msg.sender === "user" ? "text-orange-200" : "text-slate-500"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Chips */}
          <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-900 overflow-x-auto flex gap-1.5 no-scrollbar scrollbar-none">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-orange-500/20 border border-slate-800 hover:border-orange-500/40 text-slate-300 hover:text-orange-400 transition-all flex items-center gap-1"
              >
                <span>{q}</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about TickeX..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-all shadow-md shadow-orange-500/25 shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
