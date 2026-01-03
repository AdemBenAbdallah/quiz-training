import { chromium, type Browser, type Page } from "playwright";

const CERTQUICKLY_URL = process.env.QUIZ_URL || "http://localhost:3001";
const CERTIFICATE_SLUG = "dvac02";
const LEVEL_ID = 1;
const TOTAL_QUESTIONS = 50;
const DEMO_EMAIL = process.env.DEMO_EMAIL || "demo@certquickly.com";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "demo123456";

const CONFIG = {
  slowMo: 300,
  viewport: { width: 1920, height: 1080 },
};

type QuizAction = "explain" | "chat" | "answer";

function getRandomAction(): QuizAction {
  const rand = Math.random();
  if (rand < 0.4) return "explain";
  if (rand < 0.7) return "chat";
  return "answer";
}

async function waitForLoad(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
}

async function handleLogin(page: Page): Promise<boolean> {
  console.log("🔐 Checking if login is required...");

  try {
    // Check if we're already logged in by looking for user menu or dashboard
    const userMenu = page.locator("text=/Profile|Account|Sign Out/i").first();

    if (await userMenu.isVisible({ timeout: 3000 })) {
      console.log("✅ Already logged in!");
      return true;
    }
  } catch {
    // Not logged in, need to login
  }

  console.log("📝 Need to sign in...");

  try {
    // Navigate to sign in page
    await page.goto(`${CERTQUICKLY_URL}/sign-in`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    // Fill in email
    const emailInput = page
      .locator('input[type="email"], input[name="email"]')
      .first();
    if (await emailInput.isVisible()) {
      await emailInput.fill(DEMO_EMAIL);
      console.log("✅ Filled email");
    }

    // Fill in password
    const passwordInput = page
      .locator('input[type="password"], input[name="password"]')
      .first();
    if (await passwordInput.isVisible()) {
      await passwordInput.fill(DEMO_PASSWORD);
      console.log("✅ Filled password");
    }

    // Click sign in button
    const signInBtn = page
      .locator(
        "button:has-text('Sign In'), button:has-text('Sign in'), button[type='submit']",
      )
      .first();
    await signInBtn.click();
    console.log("✅ Clicked sign in");

    // Wait for redirect or dashboard
    await page.waitForTimeout(3000);

    // Check if we need to verify email (magic link flow)
    const verifyText = page.locator(
      "text=/check your email|verify|click the link/i",
    );
    if (await verifyText.first().isVisible()) {
      console.log("⚠️  Magic link login requires email verification");
      console.log(
        "   Set up DEMO_EMAIL and DEMO_PASSWORD with email/password auth",
      );
      return false;
    }

    console.log("✅ Login successful!");
    return true;
  } catch (error) {
    console.error("❌ Login failed:", error);
    return false;
  }
}

async function navigateToLevel(
  page: Page,
  slug: string,
  level: number,
): Promise<void> {
  console.log(`🎯 Navigating to ${slug} Level ${level}...`);

  // Try direct URL first
  const quizUrl = `${CERTQUICKLY_URL}/${slug}/quiz/${level}`;
  await page.goto(quizUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Debug: print page content
  console.log(`   Page URL: ${page.url()}`);

  // Check for login redirect
  if (page.url().includes("/sign-in")) {
    console.log("🔐 Redirected to sign-in page...");
    await handleLogin(page);
    await page.goto(quizUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
  }

  // Check if level is locked
  const lockedText = page.locator(
    "text=/Level Not Accessible|locked|complete previous/i",
  );
  if (await lockedText.first().isVisible({ timeout: 2000 })) {
    console.log("⚠️  Level is locked");
    console.log("   Taking screenshot for debug...");
    await page.screenshot({ path: "/tmp/quiz-locked.png" });
    throw new Error("Level is locked - check demo user progress");
  }

  console.log(`✅ On quiz page: ${page.url()}`);
}

async function clickExplainButton(page: Page): Promise<boolean> {
  try {
    // Try different selectors for the explain button
    const selectors = [
      "button:has-text('Explain')",
      "[aria-label*='Explain']",
      "[aria-label*='Explanation']",
      "[aria-label*='explanation']",
      "button[aria-label*='Explain']",
    ];

    let explainBtn = null;
    for (const selector of selectors) {
      const btn = page.locator(selector).first();
      if (await btn.isVisible({ timeout: 1000 })) {
        explainBtn = btn;
        break;
      }
    }

    if (explainBtn) {
      console.log("  📝 Opening explanation...");
      await explainBtn.click();
      await page.waitForTimeout(4000);

      // Close the dialog
      const closeSelectors = [
        "button:has-text('Close')",
        "[aria-label='Close']",
        "[aria-label*='close']",
      ];

      for (const selector of closeSelectors) {
        const closeBtn = page.locator(selector).first();
        if (await closeBtn.isVisible({ timeout: 2000 })) {
          await closeBtn.click();
          await page.waitForTimeout(1000);
          break;
        }
      }
      return true;
    }
  } catch (error) {
    console.log(`  ⚠️  Explain button error: ${error}`);
  }
  return false;
}

async function clickChatButton(page: Page): Promise<boolean> {
  try {
    // Try different selectors for the chat button
    const selectors = [
      "button:has-text('Chat')",
      "[aria-label*='Assistant']",
      "[aria-label*='Chat']",
      "[aria-label*='chat']",
      "button[aria-label*='Assistant']",
    ];

    let chatBtn = null;
    for (const selector of selectors) {
      const btn = page.locator(selector).first();
      if (await btn.isVisible({ timeout: 1000 })) {
        chatBtn = btn;
        break;
      }
    }

    if (chatBtn) {
      console.log("  💬 Opening chat assistant...");
      await chatBtn.click();
      await page.waitForTimeout(4000);

      // Close the dialog
      const closeSelectors = [
        "button:has-text('Close')",
        "[aria-label='Close']",
        "[aria-label*='close']",
      ];

      for (const selector of closeSelectors) {
        const closeBtn = page.locator(selector).first();
        if (await closeBtn.isVisible({ timeout: 2000 })) {
          await closeBtn.click();
          await page.waitForTimeout(1000);
          break;
        }
      }
      return true;
    }
  } catch (error) {
    console.log(`  ⚠️  Chat button error: ${error}`);
  }
  return false;
}

async function selectAnswerOption(page: Page): Promise<void> {
  console.log("  ✅ Selecting answer...");

  const options = page
    .locator(
      "[role='radio'], [role='checkbox'], button[class*='option'], label:has-text('A.')",
    )
    .all();

  if (options.length > 0) {
    await options[0].click();
    await page.waitForTimeout(800);
  } else {
    console.log("  ⚠️  No answer options found");
  }
}

async function clickNextButton(page: Page): Promise<boolean> {
  try {
    const nextBtn = page
      .locator(
        "button:has-text('Next'), [aria-label*='Next'], button[type='submit']",
      )
      .first();

    if (await nextBtn.isVisible({ timeout: 2000 })) {
      await nextBtn.click();
      await page.waitForTimeout(1200);
      return true;
    }
  } catch {
    // No next button
  }
  return false;
}

async function waitForQuestions(page: Page): Promise<boolean> {
  console.log("  ⏳ Waiting for questions to load...");

  // Wait for quiz content to appear
  try {
    // Wait for loading to complete
    await page.waitForSelector(
      "[role='radio'], [role='checkbox'], button[class*='option'], [class*='question'], [class*='quiz']",
      {
        timeout: 10000,
      },
    );
    await page.waitForTimeout(3000); // Extra wait for React to fully render

    // Check if questions are actually visible
    const questionCount = await page
      .locator("[role='radio'], [role='checkbox']")
      .count();

    if (questionCount > 0) {
      console.log(`  ✅ Found ${questionCount} answer options!`);
      return true;
    }

    // Try alternative selectors
    const altCount = await page
      .locator("button[class*='option'], label, div[class*='question']")
      .count();

    if (altCount > 0) {
      console.log(`  ✅ Found ${altCount} quiz elements!`);
      return true;
    }

    console.log("  ⚠️  No questions found");
    return false;
  } catch (error) {
    console.log(`  ⚠️  Questions not found: ${error}`);
    // Take screenshot for debugging
    await page.screenshot({ path: "/tmp/quiz-no-questions.png" });
    console.log("   Screenshot saved to /tmp/quiz-no-questions.png");
    return false;
  }
}

async function isQuizComplete(page: Page): Promise<boolean> {
  const completeText = page.locator(
    "text=/Complete|Submitted|Finished|Results|Score/i",
  );
  return (await completeText.count()) > 0;
}

async function handleQuestion(
  page: Page,
  questionIndex: number,
): Promise<boolean> {
  if (await isQuizComplete(page)) {
    console.log("\n🎉 Quiz completed!");
    return false;
  }

  console.log(`\n📋 Question ${questionIndex + 1}`);
  const action = getRandomAction();

  switch (action) {
    case "explain":
      if (!(await clickExplainButton(page))) {
        console.log("  ℹ️  No explain button, selecting answer...");
        await selectAnswerOption(page);
      }
      break;

    case "chat":
      if (!(await clickChatButton(page))) {
        console.log("  ℹ️  No chat button, selecting answer...");
        await selectAnswerOption(page);
      }
      break;

    case "answer":
    default:
      await selectAnswerOption(page);
      break;
  }

  await clickNextButton(page);
  return true;
}

async function submitQuiz(page: Page): Promise<void> {
  try {
    const submitBtn = page
      .locator(
        "button:has-text('Submit'), button:has-text('Finish'), button:has-text('Complete')",
      )
      .first();

    if (await submitBtn.isVisible({ timeout: 2000 })) {
      console.log("\n🎯 Submitting quiz...");
      await submitBtn.click();
      await page.waitForTimeout(3000);
    }
  } catch {
    console.log("ℹ️  Submit button not found or already submitted");
  }
}

async function runRecording(): Promise<void> {
  let browser: Browser | null = null;

  console.log("🚀 Starting CertQuickly Quiz Recording...");
  console.log(
    `📍 URL: ${CERTQUICKLY_URL}/${CERTIFICATE_SLUG}/quiz/${LEVEL_ID}`,
  );
  console.log(`📊 Questions: ${TOTAL_QUESTIONS}`);
  console.log(`👤 Demo User: ${DEMO_EMAIL}`);
  console.log("🎬 Start OBS recording, then press Enter...");
  console.log("");

  try {
    browser = await chromium.launch({
      headless: false,
      slowMo: CONFIG.slowMo,
    });

    const context = await browser.newContext({
      viewport: CONFIG.viewport,
    });
    const page = await context.newPage();

    // Navigate to the level
    await navigateToLevel(page, CERTIFICATE_SLUG, LEVEL_ID);

    // Wait for questions to load
    const hasQuestions = await waitForQuestions(page);
    if (!hasQuestions) {
      console.log("❌ Could not load questions");
      console.log("   Taking screenshot...");
      await page.screenshot({ path: "/tmp/quiz-debug.png" });
      console.log("   Screenshot: /tmp/quiz-debug.png");
      console.log("   Page HTML: /tmp/quiz-debug.html");
      await page.content().then((html) => {
        require("fs").writeFileSync("/tmp/quiz-debug.html", html);
      });
      throw new Error("Questions not loading");
    }

    let currentQuestion = 0;
    while (currentQuestion < TOTAL_QUESTIONS) {
      const continueQuiz = await handleQuestion(page, currentQuestion);
      if (!continueQuiz) break;
      currentQuestion++;
    }

    await submitQuiz(page);

    console.log("\n✨ Recording complete!");
    console.log("📹 Stop OBS recording and edit your video!");
    console.log("\n🔗 Share: https://certquickly.com");
    console.log("\n📢 Don't forget to Like, Subscribe, and hit the bell!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runRecording();
