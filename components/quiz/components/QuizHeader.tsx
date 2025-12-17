"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle, MessageCircle } from "lucide-react";

interface QuizHeaderProps {
  title: string;
  actions?: React.ReactNode;
  onExplainClick: () => void;
  onChatClick: () => void;
  isExplainDisabled?: boolean;
  onBackClick?: () => void;
}

export const QuizHeader = ({
  title,
  actions,
  onExplainClick,
  onChatClick,
  isExplainDisabled = false,
  onBackClick,
}: QuizHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        {onBackClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackClick}
            title="Back to certificate levels"
            className="mr-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onExplainClick}
          disabled={isExplainDisabled}
          title="Get explanation for this question"
          className="rounded-xl"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onChatClick}
          title="Chat with AI assistant"
          className="rounded-xl"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
