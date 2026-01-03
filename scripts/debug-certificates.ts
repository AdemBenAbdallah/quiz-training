import { chromium, type Browser } from "playwright";

const URL = process.env.QUIZ_URL || "http://localhost:3001";
const DEMO_EMAIL = process.env.DEMO_EMAIL || "demo@certquickly.com";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "demo123456";

async function debugCertificatesPage(): Promise<void> {
  let browser: Browser | null = null;

  console.log("🔍 Debug: Certificates Page Test\n");

  try {
    browser = await chromium.launch({
      headless: false,
      slowMo: 500,
      viewport: { width: 1920, height: 1080 },
    });

    const page = await browser.newContext().then((ctx) => ctx.newPage());

    // Step 1: Go to home page
    console.log("1️⃣  Going to home page...");
    await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
    console.log(`   URL: ${page.url()}`);

    // Step 2: Go to certificates page
    console.log("\n2️⃣  Going to certificates page...");
    await page.goto(`${URL}/certificates`, { waitUntil: "networkidle", timeout: 30000 });
    console.log(`   URL: ${page.url()}`);

    // Check if user is logged in
    const signInBtn = page.locator("text=/Sign In|Sign in/i");
    if (await signInBtn.isVisible({ timeout: 2000 })) {
      console.log("\n3️⃣  Not logged in, signing in...");
      await signInBtn.click();
      await page.waitForURL("**/sign-in**", { timeout: 5000 });

      // Fill email
      const emailInput = page.locator('input[type="email"]').first();
      if (await emailInput.isVisible()) {
        await emailInput.fill(DEMO_EMAIL);
        console.log("   ✅ Filled email");
      }

      // Fill password
      const passwordInput = page.locator('input[type="password"]').first();
      if (await passwordInput.isVisible()) {
        await passwordInput.fill(DEMO_PASSWORD);
        console.log("   ✅ Filled password");
      }

      // Click sign in
      await page.locator("button:has-text('Sign'), button[type='submit']").first().click();
      console.log("   ✅ Clicked sign in");

      // Wait for redirect
      await page.waitForTimeout(5000);
      console.log(`   URL after login: ${page.url()}`);
    } else {
      console.log("\n3️⃣  Already logged in!");
    }

    // Step 4: Go to certificates page again
    console.log("\n4️⃣  Going to certificates page (logged in)...");
    await page.goto(`${URL}/certificates`, { waitUntil: "networkidle", timeout: 30000 });
    console.log(`   URL: ${page.url()}`);

    // Check page content
    const pageContent = await page.content();
    const hasCertificates = pageContent.includes("AWS") || pageContent.includes("certificate");
    console.log(`   Has certificate content: ${hasCertificates}`);

    // Save screenshot
    await page.screenshot({ path: "/tmp/certificates-debug.png", fullPage: true });
    console.log("\n   📸 Screenshot saved: /tmp/certificates-debug.png");

    // Step 5: Click on dvac02 certificate
    console.log("\n5️⃣  Clicking on dvac02 certificate...");
    const dvac02Btn = page.locator("text=/dvac02|DVA-C02|Developer Associate/i").first();

    if (await dvac02Btn.isVisible({ timeout: 5000 })) {
      await dvac02Btn.click();
      await page.waitForTimeout(2000);
      console.log(`   URL after click: ${page.url()}`);
    } else {
      console.log("   ⚠️  dvac02 button not found");
      // List all links on page
      const links = await page.locator("a").all();
      console.log(`   Found ${links.length} links on page`);
    }

    // Step 6: Check levels page
    console.log("\n6️⃣  Going to levels page...");
    await page.goto(`${URL}/dvac02/levels`, { waitUntil: "networkidle", timeout: 30000 });
    console.log(`   URL: ${page.url()}`);

    // Check for level buttons
    const levelButtons = await page.locator("text=/Level /i").all();
    console.log(`   Found ${levelButtons.length} level buttons`);

    // Save screenshot
    await page.screenshot({ path: "/tmp/levels-debug.png", fullPage: true });
    console.log("\n   📸 Screenshot saved: /tmp/levels-debug.png");

    // Step 7: Try to go to level 1 quiz
    console.log("\n7️⃣  Going to level 1 quiz...");
    await page.goto(`${URL}/dvac02/quiz/1`, { waitUntil: "networkidle", timeout: 30000 });
    console.log(`   URL: ${page.url()}`);

    await page.waitForTimeout(3000);

    // Check page content
    const quizContent = await page.content();
    const isLocked = quizContent.includes("locked") || quizContent.includes("not accessible") || quizContent.includes("Level Not Accessible");
    const hasQuestions = quizContent.includes("question") || quizContent.includes("Question");

    console.log(`   Is locked: ${isLocked}`);
    console.log(`   Has questions: ${hasQuestions}`);

    // Save screenshot
    await page.screenshot({ path: "/tmp/quiz1-debug.png", fullPage: true });
    console.log("\n   📸 Screenshot saved: /tmp/quiz1-debug.png");

    console.log("\n✅ Debug complete!");
    console.log("\n📁 Check these files:");
    console.log("   - /tmp/certificates-debug.png");
    console.log("   - /tmp/levels-debug.png");
    console.log("   - /tmp/quiz1-debug.png");

  } catch (error) {
    console.error("\n❌ Error:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugCertificatesPage()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
