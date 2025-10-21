import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyButtonProps {
  handleCopyAction: () => void;
  className?: string;
}

export default function CopyButton({
  className = "",
  handleCopyAction,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCopyAction();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className={`cursor-pointer flex items-center gap-2 p-2 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded ${className}`}
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
        </TooltipTrigger>

        <TooltipContent side="top">
          {copied ? "Copied!" : "Copy to clipboard"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
