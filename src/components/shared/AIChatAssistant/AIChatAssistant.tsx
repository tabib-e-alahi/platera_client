"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import "./AIChatAssistant.css";

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface DisplayMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SYSTEM_INSTRUCTION = `You are Platera's friendly food assistant — an AI guide for a Bangladesh-based food delivery platform that connects customers with restaurants, home kitchens, street food vendors, and shops.

Platera details:
- Customers browse restaurants, filter by city/category/dietary needs, add meals to cart, and checkout.
- Business types: Restaurant, Home Kitchen, Shop, Street Food.
- Dietary tags: Halal, Vegan, Vegetarian, Gluten Free, Dairy Free.
- Order statuses: Placed, Accepted, Preparing, Out for Delivery, Delivered.
- Payment: Cash on Delivery (COD) or online payment.
- Users leave reviews after delivery.
- Providers (restaurant/kitchen owners) add meals, manage menus, track orders, view earnings.
- Admins manage the platform, approve providers, handle settlements.
- Platform covers all districts of Bangladesh.

Your role: Help customers find food, understand the platform, troubleshoot orders, and navigate the app. Be warm, concise, and specific. For real-time data (prices, stock), guide them to the right section in the app instead.

Keep answers under 120 words unless detail is truly needed. Use friendly, conversational language.`;

const SUGGESTIONS = [
  "Best restaurants near me",
  "Halal food options",
  "How do I track my order?",
  "What's a Home Kitchen?",
  "How do I become a provider?",
  "Cancel or change an order",
];

export default function AIChatAssistant() {
  const [open, setOpen] = useState(false);
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your Platera food assistant 🍽️ I can help you find restaurants, explore meals, understand orders, check dietary options, and more. What are you looking for today?",
      timestamp: new Date(),
    },
  ]);
  const [geminiHistory, setGeminiHistory] = useState<GeminiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const GEMINI_URL = `/api/gemini`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setDisplayMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed, timestamp: new Date() },
    ]);

    const newHistory: GeminiMessage[] = [
      ...geminiHistory,
      { role: "user", parts: [{ text: trimmed }] },
    ];

    setInput("");
    setLoading(true);
    setShowSuggestions(false);

    try {
      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: newHistory,
          generationConfig: { maxOutputTokens: 256, temperature: 0.7 },
        }),
      });
console.log(response);
      const data = await response.json();
      console.log(data);
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't process that. Please try again.";

      const updatedHistory: GeminiMessage[] = [
        ...newHistory,
        { role: "model", parts: [{ text: reply }] },
      ];
      setGeminiHistory(updatedHistory);

      setDisplayMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, timestamp: new Date() },
      ]);
    } catch {
      setDisplayMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please check your internet and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <button
        className="plai-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open Platera assistant"}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="plai-panel" role="dialog" aria-label="Platera AI assistant">
          <div className="plai-header">
            <div className="plai-header-avatar">🍽️</div>
            <div className="plai-header-info">
              <h3>Platera Assistant</h3>
              <p>Food guide · restaurants · orders</p>
            </div>
            <span className="plai-online-dot" aria-label="Online" />
          </div>

          <div className="plai-messages">
            {displayMessages.map((msg, i) => (
              <div key={i} className={`plai-row ${msg.role === "user" ? "plai-row--user" : ""}`}>
                {msg.role === "assistant" && <div className="plai-avatar">🍽️</div>}
                <div>
                  <div className={`plai-bubble plai-bubble--${msg.role}`}>
                    {msg.content}
                  </div>
                  <span className="plai-time">{formatTime(msg.timestamp)}</span>
                </div>
                {msg.role === "user" && (
                  <div className="plai-avatar plai-avatar--user">You</div>
                )}
              </div>
            ))}

            {loading && (
              <div className="plai-row">
                <div className="plai-avatar">🍽️</div>
                <div className="plai-bubble plai-bubble--assistant plai-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showSuggestions && (
            <div className="plai-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="plai-chip" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="plai-input-row">
            <textarea
              ref={inputRef}
              className="plai-input"
              placeholder="Ask about food, restaurants, orders..."
              value={input}
              rows={1}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "36px";
                e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="plai-send"
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? <Loader2 size={16} className="plai-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}