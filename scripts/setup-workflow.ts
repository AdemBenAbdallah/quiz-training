#!/usr/bin/env tsx

import * as fs from "fs";
import * as path from "path";

async function setupWorkflow() {
  console.log("🚀 Setting up Automated Reminder Email Workflow...\n");

  // Check if .env.local exists
  const envLocalPath = path.join(process.cwd(), ".env.local");
  const envExamplePath = path.join(process.cwd(), ".env.example");

  if (!fs.existsSync(envLocalPath)) {
    console.log("📝 Creating .env.local file...");

    const envContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/quiz_training"

# Email Service (Resend)
RESEND_API_KEY="re_1234567890abcdefghijklmnopqrstuvwxyz"

# Workflow Security
WORKFLOW_API_KEY="your-secure-workflow-api-key-change-this"
NEXT_PUBLIC_WORKFLOW_API_KEY="your-secure-workflow-api-key-change-this"

# Application
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-change-this"

# Optional: Custom email sender
# CUSTOM_SENDER_EMAIL="noreply@yourdomain.com"
`;

    fs.writeFileSync(envLocalPath, envContent);
    console.log("✅ Created .env.local file");
    console.log(
      "⚠️  Please update the environment variables with your actual values\n",
    );
  }

  if (!fs.existsSync(envExamplePath)) {
    console.log("📝 Creating .env.example file...");
    fs.writeFileSync(
      envExamplePath,
      `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/quiz_training"

# Email Service (Resend)
RESEND_API_KEY="re_1234567890abcdefghijklmnopqrstuvwxyz"

# Workflow Security
WORKFLOW_API_KEY="your-secure-workflow-api-key"
NEXT_PUBLIC_WORKFLOW_API_KEY="your-secure-workflow-api-key"

# Application
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
`,
    );
    console.log("✅ Created .env.example file\n");
  }

  // Instructions for the user
  console.log("📋 Setup Complete! Next steps:");
  console.log("1. Update your .env.local file with real values");
  console.log("2. Run 'npm run db:push' to update the database schema");
  console.log("3. Run 'npm run init-workflow' to start the automated workflow");
  console.log("4. Visit '/workflow-dashboard' to monitor the workflow");
  console.log(
    "5. Use 'npm run workflow:inspect' to open the Workflow DevKit interface\n",
  );

  console.log("🎯 Key Features Enabled:");
  console.log("• Automated reminder emails to inactive users");
  console.log("• Smart scheduling (24-hour intervals)");
  console.log("• Anti-spam protection (max 1 email per 7 days)");
  console.log("• Multiple email templates");
  console.log("• Real-time monitoring dashboard");
  console.log("• Automatic retry for failed emails\n");

  console.log("📚 For more information, see WORKFLOW_README.md");
}

// Run the setup
if (require.main === module) {
  setupWorkflow().catch(console.error);
}

export { setupWorkflow };
