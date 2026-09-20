import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, RotateCcw, Sparkles, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_URL } from "../../config/api";

export const DEFAULT_SUGGESTIONS = [
  "How does Carbon Sahayak calculate credits?",
  "Why is methane reduction important?",
  "How are credits tokenized on Polygon Amoy?",
  "How do I buy & retire carbon credits?",
  "Where can I see my wallet balance?"
];

const INITIAL_MESSAGES = [
  {
    id: "welcome-1",
    sender: "assistant",
    content: "Hi there! 👋 I'm your **EcoSankalp Assistant**.",
    timestamp: "Just now"
  },
  {
    id: "welcome-2",
    sender: "assistant",
    content: "Ask me anything about calculating waste credits in **Carbon Sahayak**, how our **Polygon Amoy smart contracts** work, or how to buy and retire credits on the **Marketplace**.",
    timestamp: "Just now"
  }
];

function TypingIndicator({ className }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-emerald-200 bg-white/95 px-3.5 py-2.5 shadow-sm text-slate-600",
        className
      )}
    >
      <span className="text-xs text-emerald-800 font-medium mr-1">Thinking</span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-emerald-600"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98, x: isUser ? 10 : -10 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div className={cn("flex items-end gap-2 max-w-[88%]", isUser && "flex-row-reverse")}>
        {!isUser ? (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full overflow-hidden bg-white shadow-sm border border-emerald-200 p-0.5">
            <img src="/Eco.svg" alt="Eco" className="h-full w-full object-contain" />
          </div>
        ) : (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 shadow-sm border border-slate-300">
            <User className="size-3.5" />
          </div>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line transition-all",
            isUser
              ? "rounded-tr-sm bg-green-700 text-white shadow-sm font-medium"
              : "rounded-tl-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
          )}
        >
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}

export function ChatMessages({ onClose, className }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = async (userText) => {
    const text = (userText || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4)
        })
      });

      const data = await response.json();
      const replyContent = data.reply || "I couldn't process that query right now. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          content: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          content: "Sorry, I couldn't reach the server. Please check your network connection or verify that the backend is running.",
          timestamp: "Error"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc] text-slate-900 shadow-2xl backdrop-blur-md",
        className
      )}
    >
      {/* HEADER - Clean EcoSankalp Green Palette */}
      <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3.5 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-emerald-200 p-0.5">
            <img src="/Eco.svg" alt="EcoSankalp" className="h-full w-full object-contain" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              EcoSankalp Assistant
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                AI Helper
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">Ask about calculations, marketplace & wallet</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={resetChat}
            title="Reset conversation"
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <RotateCcw className="size-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              title="Close chat"
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div
        ref={scrollRef}
        role="log"
        className="flex-1 space-y-3.5 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent bg-[#f5f7fb]"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
      </div>

      {/* QUICK SUGGESTIONS */}
      {messages.length <= 3 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Quick Questions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DEFAULT_SUGGESTIONS.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt)}
                disabled={isTyping}
                className="rounded-full border border-emerald-200 bg-emerald-50/70 px-2.5 py-1 text-[11px] font-medium text-emerald-900 hover:bg-emerald-100 hover:border-emerald-300 transition text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* INPUT BAR */}
      <div className="border-t border-slate-200 bg-white p-3">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 focus-within:border-green-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100 transition shadow-sm">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            placeholder="Type your question here..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => sendMessage()}
            disabled={isTyping || !inputValue.trim()}
            aria-label="Send message"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-all",
              inputValue.trim() && !isTyping
                ? "bg-green-700 text-white shadow hover:bg-green-800 active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            <Send className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatMessages;
