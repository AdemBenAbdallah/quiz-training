export interface GamificationStats {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  levelProgress: number;
  levelXpRequired: number;
  levelXpCurrent: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  questionsAnswered: number;
  dailyGoal: DailyGoalProgress;
}

export interface DailyGoalProgress {
  questionsAnswered: number;
  xpEarned: number;
  goalType: "questions" | "xp";
  goalValue: number;
  isCompleted: boolean;
  progress: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  type: "milestone" | "streak" | "performance" | "progress" | "special" | "mastery";
  icon: string;
  tier: "bronze" | "silver" | "gold";
  isUnlocked: boolean;
  earnedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface KnowledgeTopic {
  name: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface KnowledgeGaps {
  topics: KnowledgeTopic[];
  weakAreas: string[];
  strongAreas: string[];
}

export interface XpGainEvent {
  userId: string;
  action: "correct_answer" | "incorrect_answer" | "level_complete" | "daily_goal" | "perfect_score" | "first_try";
  certificateSlug?: string;
  levelId?: number;
  questionCount?: number;
  score?: number;
}

export interface XpGainResult {
  xpEarned: number;
  newTotalXp: number;
  levelUp: boolean;
  newLevel?: number;
  levelProgress: number;
  achievementsUnlocked?: Achievement[];
}

export interface StreakUpdateResult {
  currentStreak: number;
  longestStreak: number;
  streakIncreased: boolean;
  streakMaintained: boolean;
  streakLost: boolean;
  daysSinceLastActivity: number;
}

export const XP_REWARDS = {
  CORRECT_ANSWER: 10,
  INCORRECT_ANSWER: 2,
  PERFECT_LEVEL_BONUS: 50,
  LEVEL_COMPLETE_BASE: 100,
  LEVEL_COMPLETE_MULTIPLIER: 10,
  FIRST_TRY_BONUS: 25,
  DAILY_GOAL_COMPLETE: 50,
} as const;

export const LEVEL_THRESHOLDS = [
  0,
  500,
  1500,
  3000,
  5000,
  8000,
  12000,
  18000,
  25000,
  35000,
  50000,
];

export const ACHIEVEMENT_DEFINITIONS = [
  { id: "first_question", name: "First Steps", description: "Answer your first question", xpReward: 10, type: "milestone" as const, icon: "🎯", tier: "bronze" as const },
  { id: "ten_questions", name: "Getting Started", description: "Answer 10 questions", xpReward: 50, type: "milestone" as const, icon: "🚀", tier: "bronze" as const },
  { id: "hundred_questions", name: "Century Club", description: "Answer 100 questions", xpReward: 200, type: "milestone" as const, icon: "💯", tier: "silver" as const },
  { id: "five_hundred_questions", name: "Half Marathon", description: "Answer 500 questions", xpReward: 500, type: "milestone" as const, icon: "🏃", tier: "silver" as const },
  { id: "first_streak", name: "On Fire", description: "Achieve a 3-day streak", xpReward: 50, type: "streak" as const, icon: "🔥", tier: "bronze" as const },
  { id: "week_warrior", name: "Week Warrior", description: "Achieve a 7-day streak", xpReward: 150, type: "streak" as const, icon: "⚔️", tier: "silver" as const },
  { id: "month_master", name: "Monthly Master", description: "Achieve a 30-day streak", xpReward: 500, type: "streak" as const, icon: "👑", tier: "gold" as const },
  { id: "perfect_score", name: "Perfectionist", description: "Get 100% on a level", xpReward: 100, type: "performance" as const, icon: "✨", tier: "silver" as const },
  { id: "speed_demon", name: "Speed Demon", description: "Answer 10 questions in 5 minutes", xpReward: 75, type: "performance" as const, icon: "⚡", tier: "bronze" as const },
  { id: "first_level", name: "Level Up", description: "Complete your first level", xpReward: 100, type: "milestone" as const, icon: "📈", tier: "bronze" as const },
  { id: "half_certification", name: "Halfway There", description: "Complete 50% of a certification", xpReward: 300, type: "progress" as const, icon: "🏅", tier: "silver" as const },
  { id: "certification_ready", name: "Certification Ready", description: "Complete all levels of a certificate", xpReward: 1000, type: "mastery" as const, icon: "🎓", tier: "gold" as const },
  { id: "early_bird", name: "Early Bird", description: "Complete a quiz before 7 AM", xpReward: 25, type: "special" as const, icon: "🌅", tier: "bronze" as const },
  { id: "night_owl", name: "Night Owl", description: "Complete a quiz after 10 PM", xpReward: 25, type: "special" as const, icon: "🦉", tier: "bronze" as const },
  { id: "weekend_warrior", name: "Weekend Warrior", description: "Complete 50 questions on weekend", xpReward: 100, type: "special" as const, icon: "🎪", tier: "bronze" as const },
];

export const DAILY_GOAL_DEFAULT = 20;
