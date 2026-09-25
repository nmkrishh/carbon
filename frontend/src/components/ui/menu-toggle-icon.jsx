import { motion } from "motion/react";
import { Menu, X } from "lucide-react";

export function MenuToggleIcon({ open, className = "" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.div
        initial={false}
        animate={{ opacity: open ? 0 : 1, rotate: open ? 90 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Menu className="w-full h-full" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, rotate: open ? 0 : -90 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <X className="w-full h-full" />
      </motion.div>
    </div>
  );
}
