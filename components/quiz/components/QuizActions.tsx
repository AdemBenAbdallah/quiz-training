"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, FileText } from "lucide-react";
import NextLink from "next/link";

interface QuizActionsProps {
  onReset: () => void;
  levelId: number;
  showActions?: boolean;
}

export const QuizActions = ({
  onReset,
  levelId,
  showActions = true
}: QuizActionsProps) => {
  if (!showActions) {
    return null;
  }

  return (
    <div className="flex justify-center space-x-4 pt-4">
      <Button
        onClick={onReset}
        variant="outline"
        className="bg-muted hover:bg-muted/80 w-full"
      >
        <RefreshCw className="mr-2 h-4 w-4" /> Reset Quiz
      </Button>

      <Button
        asChild
        className="bg-primary hover:bg-primary/90 w-full"
      >
        <NextLink href={`/level/${levelId}`}>
          <FileText className="mr-2 h-4 w-4" /> View All Parts
        </NextLink>
      </Button>
    </div>
  );
};
