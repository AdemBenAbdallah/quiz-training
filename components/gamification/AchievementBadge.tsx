"use client";

import { Achievement } from "@/types/gamification";
import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  onClick?: () => void;
}

export function AchievementBadge({
  achievement,
  size = "md",
  showProgress = false,
  onClick,
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-xl",
    md: "w-14 h-14 text-2xl",
    lg: "w-20 h-20 text-4xl",
  };

  const tierColors = {
    bronze: "from-amber-400 to-amber-600",
    silver: "from-gray-300 to-gray-500",
    gold: "from-yellow-400 to-yellow-600",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
        achievement.isUnlocked
          ? `bg-gradient-to-br ${tierColors[achievement.tier]} border-transparent shadow-lg`
          : "bg-gray-100 border-gray-200 opacity-60 grayscale",
        onClick && "cursor-pointer hover:scale-105",
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm",
          sizeClasses[size],
        )}
      >
        {achievement.icon}
      </div>

      {size !== "sm" && (
        <div className="text-center">
          <p className="font-bold text-xs text-white">{achievement.name}</p>
          {achievement.isUnlocked && size === "lg" && (
            <p className="text-[10px] text-white/80 mt-0.5">
              {achievement.xpReward} XP
            </p>
          )}
        </div>
      )}

      {!achievement.isUnlocked && showProgress && achievement.progress !== undefined && (
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full shadow border px-1.5 py-0.5">
          <span className="text-[10px] font-medium">{achievement.progress}%</span>
        </div>
      )}

      {achievement.isUnlocked && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
