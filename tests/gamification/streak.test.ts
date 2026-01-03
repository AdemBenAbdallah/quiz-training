import { describe, it, expect } from "vitest";
import { formatStreak, getStreakEmoji, getStreakLabel } from "../../lib/gamification/streak";

describe("Streak Utilities", () => {
  describe("formatStreak", () => {
    it("should format 0 days correctly", () => {
      expect(formatStreak(0)).toBe("0 days");
    });

    it("should format 1 day correctly", () => {
      expect(formatStreak(1)).toBe("1 day");
    });

    it("should format multiple days correctly", () => {
      expect(formatStreak(5)).toBe("5 days");
      expect(formatStreak(30)).toBe("30 days");
    });
  });

  describe("getStreakEmoji", () => {
    it("should return empty flame for 0 streak", () => {
      expect(getStreakEmoji(0)).toBe("💔");
    });

    it("should return sparkle for 1 day", () => {
      expect(getStreakEmoji(1)).toBe("✨");
    });

    it("should return fire for 3 days", () => {
      expect(getStreakEmoji(3)).toBe("🔥");
    });

    it("should return fire with swords for 7 days", () => {
      expect(getStreakEmoji(7)).toBe("🔥⚔️");
    });

    it("should return fire with crown for 14 days", () => {
      expect(getStreakEmoji(14)).toBe("🔥💎");
    });

    it("should return fire with crown for 30 days", () => {
      expect(getStreakEmoji(30)).toBe("🔥👑");
    });
  });

  describe("getStreakLabel", () => {
    it("should return 'Start your streak!' for 0 days", () => {
      expect(getStreakLabel(0)).toBe("Start your streak!");
    });

    it("should return 'Getting Started' for 1 day", () => {
      expect(getStreakLabel(1)).toBe("Getting Started");
    });

    it("should return 'On Fire' for 3 days", () => {
      expect(getStreakLabel(3)).toBe("On Fire");
    });

    it("should return 'Week Warrior' for 7 days", () => {
      expect(getStreakLabel(7)).toBe("Week Warrior");
    });

    it("should return 'Epic' for 14 days", () => {
      expect(getStreakLabel(14)).toBe("Epic");
    });

    it("should return 'Legendary' for 30 days", () => {
      expect(getStreakLabel(30)).toBe("Legendary");
    });
  });
});
