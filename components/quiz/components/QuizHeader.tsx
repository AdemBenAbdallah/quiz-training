"use client";

import CopyButton from "@/components/ui/copy-button";

interface QuizHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export const QuizHeader = ({ title, actions }: QuizHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-center text-foreground">
          {title}
        </h1>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
      <CopyButton />
    </div>
  );
};
