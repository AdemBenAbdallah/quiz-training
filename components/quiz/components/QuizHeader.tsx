"use client";

import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";

interface QuizHeaderProps {
  title: string;
  actions?: React.ReactNode;
  onExplainClick: () => void;
  onChatClick: () => void;
  isExplainDisabled?: boolean;
}

export const QuizHeader = ({
  title,
  actions,
  onExplainClick,
  onChatClick,
  isExplainDisabled = false,
}: QuizHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-center text-foreground">
          {title}
        </h1>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onExplainClick}
          disabled={isExplainDisabled}
          title="Get explanation for this question"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onChatClick}
          title="Chat with AI assistant"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
