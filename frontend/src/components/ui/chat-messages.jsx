import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, RotateCcw, X, ArrowUpRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_URL } from "../../config/api";

export const DEFAULT_SUGGESTIONS = [
  "How does Carbon Sahayak calculate credits?",
  "How are credits tokenized on Polygon Amoy?",
  "How do I buy & retire carbon credits?"
];

function TypingIndicator({ className }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-2xl rounded-tl-xs border border-stone-200 bg-white px-3 py-1.5 shadow-xs text-stone-600",
        className
      )}
    >
      <span className="text-[11px] text-[#067519] font-medium mr-0.5 font-['DM_Sans']">Thinking</span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[#067519]"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2.5, 0] }}
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
      initial={{ opacity: 0, y: 6, scale: 0.98, x: isUser ? 8 : -8 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div className={cn("flex items-end gap-1.5 max-w-[90%]", isUser && "flex-row-reverse")}>
        {!isUser ? (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full overflow-hidden bg-white shadow-xs border border-emerald-100 p-0.5 mb-0.5">
            <img src="/chatbot-avatar.png" alt="EcoSankalp AI" className="h-full w-full object-contain" />
          </div>
        ) : (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#067519]/20 text-[#067519] shadow-xs mb-0.5">
            <User className="size-3.5" />
          </div>
        )}

        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-[12px] sm:text-[12.5px] leading-relaxed whitespace-pre-line transition-all font-['DM_Sans'] shadow-xs",
            isUser
              ? "rounded-tr-xs bg-[#067519] text-white font-medium"
              : "rounded-tl-xs border border-stone-200/90 bg-white text-stone-800"
          )}
        >
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}

export function ChatMessages({ onClose, className }) {
  const [messages, setMessages] = useState([]);
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
    setMessages([]);
    setInputValue("");
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
        "relative flex flex-col h-full w-full overflow-hidden bg-gradient-to-b from-[#067519] via-[#0b8020]/95 via-30% to-[#ffffff] text-stone-900 select-none",
        className
      )}
    >
      {/* TOP HEADER - Lush Green Gradient Area */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-white shadow-xs border border-white/90 p-0.5 overflow-hidden">
            <img src="/chatbot-avatar.png" alt="EcoSankalp AI" className="h-full w-full object-contain" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold font-['Poppins'] text-white leading-tight">
              EcoSankalp AI
            </h3>
            <p className="text-[9.5px] text-white/90 font-['DM_Sans'] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Online Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={resetChat}
              title="Reset conversation"
              className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-sm transition"
            >
              <RotateCcw className="size-3" />
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              title="Close chat"
              className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-sm transition"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* BODY: SIMPLE START STATE VS ACTIVE CONVERSATION */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 text-center">
          {/* Centered Logo Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md border border-emerald-100/80 p-1.5 mb-2.5"
          >
            <img src="/chatbot-avatar.png" alt="EcoSankalp AI" className="h-full w-full object-contain" />
          </motion.div>

          {/* Clean Greeting Headline */}
          <motion.h2
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.25 }}
            className="font-['Lora',serif] text-xl font-normal text-stone-800 tracking-tight"
          >
            Good day, Eco Member
          </motion.h2>

          <motion.p
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.25 }}
            className="mt-0.5 text-[11px] text-stone-100 font-['DM_Sans'] max-w-[230px] leading-snug"
          >
            Ask me anything about credit calculations, smart contracts, or the marketplace.
          </motion.p>

          {/* Quick Suggestion Chips */}
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.16, duration: 0.25 }}
            className="mt-3.5 w-full max-w-[280px] flex flex-col gap-1.5"
          >
            {DEFAULT_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(suggestion)}
                className="group flex items-center justify-between text-left text-[11.5px] font-['DM_Sans'] text-stone-700 bg-white hover:text-[#067519] border border-stone-200 hover:border-[#067519]/50 rounded-xl px-3 py-2 shadow-xs transition-all duration-150"
              >
                <span className="line-clamp-1 font-medium">{suggestion}</span>
                <ArrowUpRight className="size-3 text-stone-400 group-hover:text-[#067519] shrink-0 ml-1 transition-colors" />
              </button>
            ))}
          </motion.div>
        </div>
      ) : (
        /* CONVERSATION MESSAGES LIST */
        <div
          ref={scrollRef}
          role="log"
          className="flex-1 space-y-2.5 overflow-y-auto px-3.5 py-2.5 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent select-text"
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          <AnimatePresence>
            {isTyping && (
              <div className="flex items-end gap-1.5 max-w-[90%]">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full overflow-hidden bg-white shadow-xs border border-emerald-100 p-0.5 mb-0.5">
                  <img src="/chatbot-avatar.png" alt="EcoSankalp AI" className="h-full w-full object-contain" />
                </div>
                <TypingIndicator />
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* DOCKED INPUT BAR - CLEAN PILL WITH ONLY TEXT INPUT & SEND BUTTON */}
      <div className="px-3 py-2 bg-white border-t border-stone-200/80 shrink-0">
        <div className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 focus-within:border-[#067519] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#067519]/20 transition-all shadow-xs">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            placeholder="How can I help you today?"
            className="flex-1 bg-transparent text-xs font-['DM_Sans'] text-stone-800 outline-none placeholder:text-stone-400 disabled:cursor-not-allowed py-1"
          />
          <button
            onClick={() => sendMessage()}
            disabled={isTyping || !inputValue.trim()}
            aria-label="Send message"
            className={cn(
              "flex h-6.5 w-6.5 items-center justify-center rounded-full transition-all shrink-0",
              inputValue.trim() && !isTyping
                ? "bg-[#067519] text-white shadow-xs hover:bg-[#056014] active:scale-95 cursor-pointer"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            )}
          >
            <Send className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatMessages;
