import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import {
  QuizQuestion,
  cleanOptions,
  generateCacheKey,
  processQuestionForCache,
} from "../lib/explain-utils";
import { quizLevels } from "../public/quiz";

console.log("🧪 Testing Cache Key Consistency\n");

// Test with first few questions from different levels
const testQuestions: QuizQuestion[] = [
  quizLevels[0][0] as QuizQuestion,
  quizLevels[0][1] as QuizQuestion,
  quizLevels[1][0] as QuizQuestion,
];

console.log("📋 Testing Questions:");
testQuestions.forEach((q, i) => {
  console.log(`${i + 1}. ${q.question.substring(0, 60)}...`);
});
console.log();

console.log("🔍 Cache Key Generation Tests:\n");

testQuestions.forEach((question, index) => {
  console.log(`📝 Question ${index + 1}:`);
  console.log(`   Question: ${question.question.substring(0, 50)}...`);
  console.log(`   Original choices:`, question.choices);
  console.log(`   Answers:`, question.answers);

  // Method 1: Using processQuestionForCache (warm-cache.ts style)
  const { cacheKey: cacheKey1, cleanedOptions: cleanedOptions1 } =
    processQuestionForCache(question);

  // Method 2: Manual process (API route style)
  const cleanedOptions2 = cleanOptions(question.choices);
  const cacheKey2 = generateCacheKey(
    question.question,
    cleanedOptions2,
    question.answers as ("A" | "B" | "C" | "D" | "E")[],
  );

  console.log(`   Cleaned choices (method 1):`, cleanedOptions1);
  console.log(`   Cleaned choices (method 2):`, cleanedOptions2);
  console.log(`   Cache key 1: ${cacheKey1}`);
  console.log(`   Cache key 2: ${cacheKey2}`);
  console.log(`   ✅ Keys match:`, cacheKey1 === cacheKey2);
  console.log(
    `   ✅ Options match:`,
    JSON.stringify(cleanedOptions1) === JSON.stringify(cleanedOptions2),
  );

  if (cacheKey1 !== cacheKey2) {
    console.log(`   ❌ MISMATCH DETECTED!`);
    console.log(`   🔍 Difference analysis:`);
    console.log(`      Key 1 length: ${cacheKey1.length}`);
    console.log(`      Key 2 length: ${cacheKey2.length}`);
  }

  console.log();
});

console.log("🎯 Summary:");
const allMatch = testQuestions.every((question) => {
  const { cacheKey: key1 } = processQuestionForCache(question);
  const cleanedOptions = cleanOptions(question.choices);
  const key2 = generateCacheKey(
    question.question,
    cleanedOptions,
    question.answers as ("A" | "B" | "C" | "D" | "E")[],
  );
  return key1 === key2;
});

if (allMatch) {
  console.log(
    "✅ All cache keys match! The warm-cache and API route will use identical keys.",
  );
  console.log("🎉 Your cached explanations should work correctly!");
} else {
  console.log("❌ Cache key mismatch detected!");
  console.log("🔧 Check the shared utilities implementation for consistency.");
}

console.log();
console.log("🔧 Testing with sample frontend data format:");

// Simulate what frontend might send
const frontendPayload = {
  question: testQuestions[0].question,
  options: testQuestions[0].choices, // Raw choices with "A. ", "B. ", etc.
  answer: testQuestions[0].answers,
};

console.log("Frontend payload options:", frontendPayload.options);

// Process like API route would
const cleanedForAPI = cleanOptions(frontendPayload.options);
const apiCacheKey = generateCacheKey(
  frontendPayload.question,
  cleanedForAPI,
  frontendPayload.answer as ("A" | "B" | "C" | "D" | "E")[],
);

// Process like warm-cache would
const { cacheKey: warmCacheKey } = processQuestionForCache(testQuestions[0]);

console.log("API route cache key: ", apiCacheKey);
console.log("Warm cache key:     ", warmCacheKey);
console.log("Frontend->API matches warm-cache:", apiCacheKey === warmCacheKey);

if (apiCacheKey === warmCacheKey) {
  console.log("\n🎉 PERFECT! Frontend requests will find cached explanations!");
} else {
  console.log("\n❌ PROBLEM! Frontend requests will miss the cache!");
}
