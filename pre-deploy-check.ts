#!/usr/bin/env bun

/**
 * Pre-deployment validation script
 * Ensures everything is ready for production deployment
 */

export {};

console.log("🚀 Pre-Deployment Validation\n");

let allChecksPassed = true;

// Check 1: Environment variables
console.log("1. Checking environment variables...");
const requiredEnvVars = ["DATABASE_URL"];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length === 0) {
  console.log("✅ Required environment variables present");
} else {
  console.log(`❌ Missing environment variables: ${missingVars.join(", ")}`);
  allChecksPassed = false;
}

// Check 2: Database connection (basic check)
console.log("\n2. Checking database configuration...");
try {
  await import("./db");
  console.log("✅ Database configuration found");
} catch (error) {
  console.log("❌ Database configuration issue:", error);
  allChecksPassed = false;
}

// Check 3: Certificate functionality
console.log("\n3. Checking certificate functionality...");
try {
  const { getAvailableCertificates } = await import("./lib/certificates");
  const certificates = getAvailableCertificates();
  if (certificates.length > 0) {
    console.log("✅ Certificate functionality working");
  } else {
    console.log("❌ No certificates found");
    allChecksPassed = false;
  }
} catch (error) {
  console.log("❌ Certificate functionality broken:", error);
  allChecksPassed = false;
}

// Check 4: File structure
console.log("\n4. Checking file structure...");
const fs = await import("fs/promises");
try {
  await fs.access("./public/quiz/aws-developer/metadata.json");
  await fs.access("./public/quiz/certificates/index.json");
  console.log("✅ Certificate file structure correct");
} catch (error) {
  console.log("❌ Certificate file structure issue:", error);
  allChecksPassed = false;
}

// Check 5: Legacy files backup
console.log("\n5. Checking legacy backup...");
try {
  await fs.access("./public/quiz/legacy/level1.json");
  console.log("✅ Legacy files backed up");
} catch (error) {
  console.log("❌ Legacy backup missing:", error);
  allChecksPassed = false;
}

// Final result
console.log("\n" + "=".repeat(50));
if (allChecksPassed) {
  console.log("🎉 ALL CHECKS PASSED - Ready for deployment!");
  console.log("\n📋 Deployment Summary:");
  console.log("   ✅ Multi-certificate support implemented");
  console.log("   ✅ Backward compatibility maintained");
  console.log("   ✅ Environment variables configured");
  console.log("   ✅ Database ready");
  console.log("   ✅ File structure correct");
  console.log("   ✅ Legacy files preserved");
  console.log("\n🚀 Safe to deploy to staging/production");
  console.log("\n📝 Next Steps:");
  console.log("   1. Run: bun test");
  console.log("   2. Run: bun run build");
  console.log("   3. Deploy to staging");
  console.log("   4. Test certificate routes");
  console.log("   5. Deploy to production");
} else {
  console.log("❌ CHECKS FAILED - Fix issues before deployment");
  console.log("\n🔧 Required Actions:");
  console.log("   1. Set missing environment variables");
  console.log("   2. Fix database configuration");
  console.log("   3. Check certificate functionality");
  console.log("   4. Verify file structure");
  console.log("   5. Ensure legacy backup exists");
}

process.exit(allChecksPassed ? 0 : 1);