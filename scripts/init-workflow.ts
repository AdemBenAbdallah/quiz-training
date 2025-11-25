#!/usr/bin/env tsx

import { sendReminderEmails } from "@/workflows/send-reminder-emails";
import { start } from "workflow/api";

async function initWorkflow() {
  console.log("🚀 Initializing reminder email workflow...");

  try {
    // Start the workflow
    const workflow = await start(sendReminderEmails, []);

    console.log("✅ Workflow started successfully!");
    console.log(`Workflow ID: ${workflow.runId}`);
    console.log(`Status: ${workflow.status}`);
    console.log("\n📝 The workflow will now run automatically every 24 hours.");
    console.log("📊 Visit /workflow-dashboard to monitor the workflow.");
    console.log(
      "🔗 Use the Workflow DevKit CLI to inspect runs: npx workflow inspect runs --web",
    );
  } catch (error) {
    console.error("❌ Failed to initialize workflow:", error);
    process.exit(1);
  }
}

// Run the initialization
if (require.main === module) {
  initWorkflow();
}

export { initWorkflow };
