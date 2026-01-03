-- Gamification Features Migration
-- Adds tables for XP, streaks, achievements, and knowledge tracking

-- 1. User Gamification Stats
CREATE TABLE IF NOT EXISTS "user_gamification" (
  "id" text PRIMARY KEY NOT NULL,
  "total_xp" integer NOT NULL DEFAULT 0,
  "current_streak" integer NOT NULL DEFAULT 0,
  "longest_streak" integer NOT NULL DEFAULT 0,
  "last_activity_date" timestamp,
  "level" integer NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT NOW(),
  "updated_at" timestamp NOT NULL DEFAULT NOW()
);

-- 2. User Achievements (earned badges)
CREATE TABLE IF NOT EXISTS "user_achievement" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "achievement_id" text NOT NULL,
  "earned_at" timestamp NOT NULL DEFAULT NOW(),
  "progress" integer,
  "is_complete" boolean NOT NULL DEFAULT false
);

-- 3. Question Attempts (for knowledge tracking)
CREATE TABLE IF NOT EXISTS "question_attempt" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "certificate_id" text NOT NULL,
  "question_id" text NOT NULL,
  "level_id" integer NOT NULL,
  "is_correct" boolean NOT NULL,
  "topic" text,
  "answered_at" timestamp NOT NULL DEFAULT NOW()
);

-- 4. Daily Goals Progress
CREATE TABLE IF NOT EXISTS "daily_goal" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "date" date NOT NULL,
  "questions_answered" integer NOT NULL DEFAULT 0,
  "xp_earned" integer NOT NULL DEFAULT 0,
  "goal_type" text NOT NULL DEFAULT 'questions',
  "goal_value" integer NOT NULL DEFAULT 20,
  "is_completed" boolean NOT NULL DEFAULT false
);

-- 5. Achievement Definitions (reference table)
CREATE TABLE IF NOT EXISTS "achievement_definition" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "xp_reward" integer NOT NULL DEFAULT 0,
  "type" text NOT NULL,
  "icon" text,
  "tier" text DEFAULT 'bronze'
);

-- Insert achievement definitions
INSERT INTO "achievement_definition" ("id", "name", "description", "xp_reward", "type", "icon", "tier") VALUES
  ('first_question', 'First Steps', 'Answer your first question', 10, 'milestone', '🎯', 'bronze'),
  ('ten_questions', 'Getting Started', 'Answer 10 questions', 50, 'milestone', '🚀', 'bronze'),
  ('hundred_questions', 'Century Club', 'Answer 100 questions', 200, 'milestone', '💯', 'silver'),
  ('five_hundred_questions', 'Half Marathon', 'Answer 500 questions', 500, 'milestone', '🏃', 'silver'),
  ('first_streak', 'On Fire', 'Achieve a 3-day streak', 50, 'streak', '🔥', 'bronze'),
  ('week_warrior', 'Week Warrior', 'Achieve a 7-day streak', 150, 'streak', '⚔️', 'silver'),
  ('month_master', 'Monthly Master', 'Achieve a 30-day streak', 500, 'streak', '👑', 'gold'),
  ('perfect_score', 'Perfectionist', 'Get 100% on a level', 100, 'performance', '✨', 'silver'),
  ('speed_demon', 'Speed Demon', 'Answer 10 questions in 5 minutes', 75, 'performance', '⚡', 'bronze'),
  ('first_level', 'Level Up', 'Complete your first level', 100, 'milestone', '📈', 'bronze'),
  ('half_certification', 'Halfway There', 'Complete 50% of a certification', 300, 'progress', '🏅', 'silver'),
  ('certification_ready', 'Certification Ready', 'Complete all levels of a certificate', 1000, 'mastery', '🎓', 'gold'),
  ('early_bird', 'Early Bird', 'Complete a quiz before 7 AM', 25, 'special', '🌅', 'bronze'),
  ('night_owl', 'Night Owl', 'Complete a quiz after 10 PM', 25, 'special', '🦉', 'bronze'),
  ('weekend_warrior', 'Weekend Warrior', 'Complete 50 questions on weekend', 100, 'special', '🎪', 'bronze');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_user_gamification_user_id" ON "user_gamification"("id");
CREATE INDEX IF NOT EXISTS "idx_user_achievement_user_id" ON "user_achievement"("user_id");
CREATE INDEX IF NOT EXISTS "idx_question_attempt_user_id" ON "question_attempt"("user_id");
CREATE INDEX IF NOT EXISTS "idx_question_attempt_topic" ON "question_attempt"("topic");
CREATE INDEX IF NOT EXISTS "idx_daily_goal_user_date" ON "daily_goal"("user_id", "date");

-- Add foreign key constraints
ALTER TABLE "user_achievement" ADD CONSTRAINT "fk_user_achievement_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "question_attempt" ADD CONSTRAINT "fk_question_attempt_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "daily_goal" ADD CONSTRAINT "fk_daily_goal_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
