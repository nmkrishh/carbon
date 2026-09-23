import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import ChatMessages from "./ui/chat-messages";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-6 z-50 flex flex-col items-end">
      {/* POPUP CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-1 w-[92vw] sm:w-[330px] h-[480px] max-h-[85vh] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(6,117,25,0.25)] border border-emerald-900/15 origin-bottom-right"
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
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle EcoSankalp AI Assistant"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#067519] text-white shadow-[0_10px_25px_-5px_rgba(6,117,25,0.5)] transition-all hover:bg-[#056014] hover:shadow-[0_14px_30px_-4px_rgba(6,117,25,0.6)] focus:outline-none"
      >
        {/* Pulsating status ring */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
        </span>

        {isOpen ? (
          <X className="size-6 text-white transition-transform duration-200" />
        ) : (
          <div className="relative flex items-center justify-center">
            <img
              src="/chatbot-avatar.png"
              alt="EcoSankalp AI Assistant"
              className="size-9 object-contain drop-shadow transition-transform duration-200 group-hover:scale-110"
            />
            <Sparkles className="absolute -top-1.5 -right-1.5 size-3 text-emerald-200 animate-pulse" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
