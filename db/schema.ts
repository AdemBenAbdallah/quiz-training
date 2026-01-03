import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  lastReminderSentAt: timestamp("last_reminder_sent_at"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

// New multi-certificate support tables
export const certificates = pgTable("certificates", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  totalLevels: integer("total_levels").notNull().default(8),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Enhanced progress tables with certificate support (nullable for backward compatibility)
export const userLevelProgress = pgTable("user_level_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  certificateId: text("certificate_id")
    .notNull()
    .references(() => certificates.id, { onDelete: "cascade" }),
  levelId: integer("level_id").notNull(),
  passed: boolean("passed").notNull().default(false),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const userPayment = pgTable("user_payment", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  certificateId: text("certificate_id").references(() => certificates.id, {
    onDelete: "cascade",
  }),
  paymentId: text("payment_id").notNull().unique(),
  status: text("status").notNull().default("pending"),
  amount: integer("amount"),
  currency: text("currency").default("USD"),
  bundleType: text("bundle_type"),
  certificateCount: integer("certificate_count"),
  purchasedCertificates: text("purchased_certificates"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const userGamification = pgTable("user_gamification", {
  id: text("id").primaryKey(),
  totalXp: integer("total_xp").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActivityDate: timestamp("last_activity_date"),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const userAchievement = pgTable("user_achievement", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  achievementId: text("achievement_id").notNull(),
  earnedAt: timestamp("earned_at")
    .$defaultFn(() => new Date())
    .notNull(),
  progress: integer("progress"),
  isComplete: boolean("is_complete").notNull().default(false),
});

export const questionAttempt = pgTable("question_attempt", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  certificateId: text("certificate_id").notNull(),
  questionId: text("question_id").notNull(),
  levelId: integer("level_id").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  topic: text("topic"),
  answeredAt: timestamp("answered_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const dailyGoal = pgTable("daily_goal", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  questionsAnswered: integer("questions_answered").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  goalType: text("goal_type").notNull().default("questions"),
  goalValue: integer("goal_value").notNull().default(20),
  isCompleted: boolean("is_completed").notNull().default(false),
});

export const achievementDefinition = pgTable("achievement_definition", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  xpReward: integer("xp_reward").notNull().default(0),
  type: text("type").notNull(),
  icon: text("icon"),
  tier: text("tier").default("bronze"),
});

export const schema = {
  user,
  session,
  account,
  verification,
  userLevelProgress,
  userPayment,
  certificates,
  userGamification,
  userAchievement,
  questionAttempt,
  dailyGoal,
  achievementDefinition,
};
