import { describe, it, expect, vi, beforeEach } from "vitest";
import { calculateXpForAction, calculateLevel } from "../../lib/gamification";
import { XP_REWARDS } from "../../types/gamification";
import { XpGainEvent } from "../../types/gamification";

describe("XP System", () => {
  describe("calculateXpForAction", () => {
    it("should award 10 XP for each correct answer", () => {
      const event: XpGainEvent = {
        userId: "test",
        action: "correct_answer",
        questionCount: 5,
      };
      expect(calculateXpForAction(event)).toBe(50);
    });

    it("should award 2 XP for each incorrect answer", () => {
      const event: XpGainEvent = {
        userId: "test",
        action: "incorrect_answer",
        questionCount: 3,
      };
      expect(calculateXpForAction(event)).toBe(6);
    });

    it("should calculate level complete XP with base and multiplier", () => {
      const event: XpGainEvent = {
        userId: "test",
        action: "level_complete",
        levelId: 5,
      };
      // 100 + 5 * 10 = 150
      expect(calculateXpForAction(event)).toBe(150);
    });

    it("should add perfect score bonus", () => {
      const event: XpGainEvent = {
        userId: "test",
        action: "level_complete",
        levelId: 3,
        score: 100,
      };
      // 100 + 3 * 10 + 50 = 180
      expect(calculateXpForAction(event)).toBe(180);
    });

    it("should award 50 XP for daily goal completion", () => {
      const event: XpGainEvent = {
        userId: "test",
        action: "daily_goal",
      };
      expect(calculateXpForAction(event)).toBe(50);
    });
  });

  describe("calculateLevel", () => {
    it("should return level 1 for 0 XP", () => {
      const result = calculateLevel(0);
      expect(result.level).toBe(1);
      expect(result.progress).toBe(0);
    });

    it("should return level 1 for 499 XP", () => {
      const result = calculateLevel(499);
      expect(result.level).toBe(1);
      expect(result.progress).toBeLessThan(100);
    });

    it("should return level 2 for 500 XP", () => {
      const result = calculateLevel(500);
      expect(result.level).toBe(2);
      expect(result.progress).toBe(0);
    });

    it("should return level 2 for 1000 XP with 50% progress", () => {
      const result = calculateLevel(1000);
      expect(result.level).toBe(2);
      expect(result.progress).toBe(50);
    });

    it("should return level 10 for 35000 XP", () => {
      const result = calculateLevel(35000);
      expect(result.level).toBe(10);
    });

    it("should return level 11 for 50000 XP", () => {
      const result = calculateLevel(50000);
      expect(result.level).toBe(11);
    });
  });

  describe("XP Rewards constants", () => {
    it("should have correct XP reward values", () => {
      expect(XP_REWARDS.CORRECT_ANSWER).toBe(10);
      expect(XP_REWARDS.INCORRECT_ANSWER).toBe(2);
      expect(XP_REWARDS.PERFECT_LEVEL_BONUS).toBe(50);
      expect(XP_REWARDS.LEVEL_COMPLETE_BASE).toBe(100);
      expect(XP_REWARDS.DAILY_GOAL_COMPLETE).toBe(50);
    });
  });
});
