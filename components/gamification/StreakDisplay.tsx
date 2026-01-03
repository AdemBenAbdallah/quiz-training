"use client";

import { useGamification } from "@/hooks/useGamification";
import { Flame } from "lucide-react";

interface StreakDisplayProps {
  certificateSlug?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export function StreakDisplay({
  certificateSlug,
  showLabel = true,
  compact = false,
}: StreakDisplayProps) {
  const { data, isLoading } = useGamification(certificateSlug);

  if (isLoading || !data) {
    return compact ? (
      <div className="h-6 w-12 bg-muted animate-pulse rounded-full" />
    ) : (
      <div className="h-8 w-20 bg-muted animate-pulse rounded-full" />
    );
  }

  const { streak } = data;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-full ${
          streak.current >= 7
            ? "bg-orange-100 text-orange-600"
            : streak.current >= 3
              ? "bg-orange-50 text-orange-500"
              : "bg-gray-100 text-gray-500"
        }`}
      >
        <Flame className="w-4 h-4" />
        <span className="font-bold text-sm">{streak.current}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        streak.current >= 7
          ? "bg-orange-100"
          : streak.current >= 3
            ? "bg-orange-50"
            : "bg-gray-50"
      }`}
    >
      <Flame
        className={`w-5 h-5 ${
          streak.current >= 7
            ? "text-orange-500"
            : streak.current >= 3
              ? "text-orange-400"
              : "text-gray-400"
        }`}
        fill={streak.current > 0 ? "currentColor" : "none"}
      />
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold">{streak.current}</span>
          <span className="text-xs text-muted-foreground">days</span>
        </div>
        {showLabel && (
          <span className="text-xs text-muted-foreground">{streak.label}</span>
        )}
      </div>
    </div>
  );
}
