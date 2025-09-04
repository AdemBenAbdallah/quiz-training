import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Check } from "lucide-react";

export default function CopyButton() {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText("Your text to copy");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer flex items-center gap-2 p-1 transition-colors duration-300"
    >
      <AnimatePresence mode="wait" initial={false}>
        {!copied ? (
          <motion.span
            key="copy"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Copy />
          </motion.span>
        ) : (
          <motion.span
            key="check"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Check />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
