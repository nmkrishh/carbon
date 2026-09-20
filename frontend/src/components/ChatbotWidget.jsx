import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, Sparkles } from "lucide-react";
import ChatMessages from "./ui/chat-messages";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* POPUP CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 w-[92vw] sm:w-[420px] max-w-[440px] h-[580px] max-h-[82vh] shadow-2xl origin-bottom-right"
          >
            <ChatMessages
              onClose={() => setIsOpen(false)}
              className="h-full w-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING ROUND TOGGLE BUTTON */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle EcoSankalp AI Assistant"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-green-900 via-green-800 to-emerald-600 text-white shadow-[0_10px_25px_-5px_rgba(5,150,105,0.5)] transition-shadow hover:shadow-[0_14px_30px_-4px_rgba(5,150,105,0.6)] focus:outline-none"
      >
        {/* Pulsating status ring */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
        </span>

        {isOpen ? (
          <X className="size-6 text-white transition-transform duration-200" />
        ) : (
          <div className="relative">
            <MessageSquare className="size-6 text-white transition-transform group-hover:scale-110" />
            <Sparkles className="absolute -top-1.5 -right-1.5 size-3 text-emerald-300 animate-pulse" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
