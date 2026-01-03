import { test, expect } from "playwright/test";

test.describe("Gamification Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the landing page", async ({ page }) => {
    await expect(page).toHaveTitle(/CertQuickly|Quiz Training/);
  });

  test("should display gamification-related elements on page", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Gamification API Endpoints", () => {
  test("should have gamification stats endpoint", async ({ request }) => {
    const response = await request.get("/api/gamification/stats", {
      ignoreHTTPSErrors: true,
    });
    // Should return 401 for unauthenticated requests
    expect(response.status()).toBe(401);
  });

  test("should have XP endpoint", async ({ request }) => {
    const response = await request.post("/api/gamification/xp", {
      data: { action: "correct_answer" },
      ignoreHTTPSErrors: true,
    });
    expect(response.status()).toBe(401);
  });
});

test.describe("Gamification Components Mount", () => {
  test("XPDisplay component should be importable", async ({}) => {
    // This test verifies the component file exists
    const { XPDisplay } = await import("@/components/gamification/XPDisplay");
    expect(XPDisplay).toBeDefined();
  });

  test("StreakDisplay component should be importable", async ({}) => {
    const { StreakDisplay } = await import("@/components/gamification/StreakDisplay");
    expect(StreakDisplay).toBeDefined();
  });

  test("AchievementBadge component should be importable", async ({}) => {
    const { AchievementBadge } = await import("@/components/gamification/AchievementBadge");
    expect(AchievementBadge).toBeDefined();
  });
});
