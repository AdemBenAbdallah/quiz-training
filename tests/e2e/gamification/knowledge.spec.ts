import { test, expect } from "playwright/test";

test.describe("Knowledge Analytics API", () => {
  test("should have knowledge gaps endpoint", async ({ request }) => {
    const response = await request.get("/api/analytics/knowledge", {
      ignoreHTTPSErrors: true,
    });
    expect(response.status()).toBe(401);
  });

  test("knowledge endpoint should reject without auth", async ({ request }) => {
    const response = await request.get("/api/analytics/knowledge?certificate=dvac02", {
      ignoreHTTPSErrors: true,
    });
    expect(response.status()).toBe(401);
  });
});

test.describe("Gamification Types", () => {
  test("should have correct type definitions", async ({}) => {
    const {
      XP_REWARDS,
      LEVEL_THRESHOLDS,
      ACHIEVEMENT_DEFINITIONS,
    } = await import("@/types/gamification");

    expect(XP_REWARDS.CORRECT_ANSWER).toBe(10);
    expect(XP_REWARDS.INCORRECT_ANSWER).toBe(2);
    expect(XP_REWARDS.PERFECT_LEVEL_BONUS).toBe(50);
    expect(LEVEL_THRESHOLDS).toHaveLength(11);
    expect(ACHIEVEMENT_DEFINITIONS).toHaveLength(15);
  });

  test("should have achievement types", async ({}) => {
    const { ACHIEVEMENT_DEFINITIONS } = await import("@/types/gamification");

    const milestone = ACHIEVEMENT_DEFINITIONS.find((a) => a.type === "milestone");
    const streak = ACHIEVEMENT_DEFINITIONS.find((a) => a.type === "streak");
    const performance = ACHIEVEMENT_DEFINITIONS.find((a) => a.type === "performance");

    expect(milestone).toBeDefined();
    expect(streak).toBeDefined();
    expect(performance).toBeDefined();
  });
});

test.describe("Gamification Utilities", () => {
  test("calculateLevel should work correctly", async ({}) => {
    const { calculateLevel } = await import("@/lib/gamification");

    expect(calculateLevel(0).level).toBe(1);
    expect(calculateLevel(500).level).toBe(2);
    expect(calculateLevel(1000).level).toBe(2);
    expect(calculateLevel(50000).level).toBe(11);
  });

  test("calculateXpForAction should work correctly", async ({}) => {
    const { calculateXpForAction } = await import("@/lib/gamification");

    expect(
      calculateXpForAction({ userId: "test", action: "correct_answer", questionCount: 5 }),
    ).toBe(50);

    expect(
      calculateXpForAction({ userId: "test", action: "level_complete", levelId: 3 }),
    ).toBe(130); // 100 + 3*10

    expect(
      calculateXpForAction({ userId: "test", action: "level_complete", levelId: 3, score: 100 }),
    ).toBe(180); // 130 + 50 bonus
  });
});

test.describe("Streak Utilities", () => {
  test("formatStreak should format correctly", async ({}) => {
    const { formatStreak } = await import("@/lib/gamification/streak");

    expect(formatStreak(0)).toBe("0 days");
    expect(formatStreak(1)).toBe("1 day");
    expect(formatStreak(5)).toBe("5 days");
  });

  test("getStreakEmoji should return correct emoji", async ({}) => {
    const { getStreakEmoji } = await import("@/lib/gamification/streak");

    expect(getStreakEmoji(0)).toBe("💔");
    expect(getStreakEmoji(1)).toBe("✨");
    expect(getStreakEmoji(3)).toBe("🔥");
    expect(getStreakEmoji(7)).toBe("🔥⚔️");
    expect(getStreakEmoji(30)).toBe("🔥👑");
  });

  test("getStreakLabel should return correct label", async ({}) => {
    const { getStreakLabel } = await import("@/lib/gamification/streak");

    expect(getStreakLabel(0)).toBe("Start your streak!");
    expect(getStreakLabel(1)).toBe("Getting Started");
    expect(getStreakLabel(7)).toBe("Week Warrior");
    expect(getStreakLabel(30)).toBe("Legendary");
  });
});
