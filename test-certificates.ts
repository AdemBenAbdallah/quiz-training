#!/usr/bin/env bun

/**
 * Development script to test certificate functionality
 * This script tests the new multi-certificate structure
 */

import { getAvailableCertificates, getCertificateMetadata, getDefaultCertificate } from "./lib/certificates";
import { certificateLevels } from "./public/quiz";

console.log("🧪 Testing Certificate Functionality\n");

// Test 1: Load available certificates
console.log("1. Testing available certificates...");
const certificates = getAvailableCertificates();
console.log(`✅ Found ${certificates.length} certificates`);
certificates.forEach(cert => {
  console.log(`   - ${cert.name} (${cert.slug}) - ${cert.totalLevels} levels`);
});

// Test 2: Load default certificate
console.log("\n2. Testing default certificate...");
const defaultCert = getDefaultCertificate();
if (defaultCert) {
  console.log(`✅ Default certificate: ${defaultCert.name}`);
} else {
  console.log("❌ No default certificate found");
}

// Test 3: Load certificate metadata
console.log("\n3. Testing certificate metadata...");
const metadata = getCertificateMetadata('aws-developer');
if (metadata) {
  console.log(`✅ Metadata loaded for ${metadata.name}`);
  console.log(`   - Total levels: ${metadata.totalLevels}`);
  console.log(`   - Questions per level: ${metadata.questionsPerLevel.join(', ')}`);
} else {
  console.log("❌ Failed to load metadata");
}

// Test 4: Load certificate levels
console.log("\n4. Testing certificate levels...");
const awsLevels = certificateLevels['aws-developer'];
if (awsLevels) {
  console.log(`✅ Loaded ${awsLevels.length} levels for AWS Developer`);
  awsLevels.forEach((level, index) => {
    console.log(`   - Level ${index + 1}: ${level.length} questions`);
  });
} else {
  console.log("❌ Failed to load certificate levels");
}

// Test 5: Compare with legacy structure
console.log("\n5. Testing backward compatibility...");
const { quizLevels } = await import("./public/quiz");
if (awsLevels && quizLevels) {
  const isCompatible = awsLevels.every((level, index) => 
    JSON.stringify(level) === JSON.stringify(quizLevels[index])
  );
  console.log(isCompatible ? "✅ Backward compatibility maintained" : "❌ Backward compatibility broken");
} else {
  console.log("❌ Could not test backward compatibility");
}

console.log("\n🎉 Certificate functionality test completed!");