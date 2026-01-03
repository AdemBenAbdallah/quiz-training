"use client";

import { useGamification } from "@/hooks/useGamification";
import { Progress } from "@/components/ui/progress";

interface XPDisplayProps {
  certificateSlug?: string;
  showLevel?: boolean;
  showProgress?: boolean;
  compact?: boolean;
}

export function XPDisplay({
  certificateSlug,
  showLevel = true,
  showProgress = true,
  compact = false,
}: XPDisplayProps) {
  const { data, isLoading } = useGamification(certificateSlug);

  if (isLoading || !data) {
    return compact ? (
      <div className="h-6 w-16 bg-muted animate-pulse rounded" />
    ) : (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-muted animate-pulse rounded-full" />
        <div className="h-4 w-12 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  const { gamification } = data;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-lg">⭐</span>
        <span className="font-semibold text-sm">
          {gamification.totalXp.toLocaleString()}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        {showLevel && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <div>
              <span className="text-sm text-muted-foreground">Level </span>
              <span className="text-lg font-bold">{gamification.level}</span>
            </div>
          </div>
        )}
        <div className="text-right">
          <span className="text-sm font-medium">{gamification.totalXp.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground ml-1">XP</span>
        </div>
      </div>
      {showProgress && (
        <Progress
          value={gamification.levelProgress}
          className="h-2"
        />
      )}
    </div>
  );
}
