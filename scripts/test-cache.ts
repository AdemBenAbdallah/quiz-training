import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import { createClient, type RedisClientType } from "redis";
import { processQuestionForCache, QuizQuestion } from "../lib/explain-utils";
import { quizLevels } from "../public/quiz";

// Create Redis client
const redisClient: RedisClientType = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 6379,
    tls: true,
  },
});

async function testCache() {
  console.log("🧪 Testing Redis Cache for Question Explanations\n");

  try {
    // Connect to Redis
    console.log("🔌 Connecting to Redis...");
    await redisClient.connect();
    console.log("✅ Connected to Redis\n");

    // Get first few questions
    const testQuestions = [
      quizLevels[0][0] as QuizQuestion,
      quizLevels[0][1] as QuizQuestion,
      quizLevels[1][0] as QuizQuestion,
    ];

    console.log("📋 Testing with questions:");
    testQuestions.forEach((q, i) => {
      console.log(`${i + 1}. ${q.question.substring(0, 60)}...`);
    });
    console.log();

    let foundInCache = 0;
    let notFoundInCache = 0;

    for (let i = 0; i < testQuestions.length; i++) {
      const question = testQuestions[i];
      const { cacheKey } = processQuestionForCache(question);

      console.log(`🔍 Testing Question ${i + 1}:`);
      console.log(`   Cache key: ${cacheKey.substring(0, 50)}...`);

      try {
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
          console.log(`   ✅ FOUND in cache`);
          const parsed = JSON.parse(cachedData);
          console.log(
            `   📝 Explanation preview: ${parsed.explanation.substring(0, 80)}...`,
          );
          foundInCache++;
        } else {
          console.log(`   ❌ NOT FOUND in cache`);
          notFoundInCache++;
        }
      } catch (error) {
        console.log(`   💥 ERROR checking cache: ${error}`);
        notFoundInCache++;
      }

      console.log();
    }

    // Summary
    console.log("📊 Cache Test Results:");
    console.log(`   ✅ Found in cache: ${foundInCache}`);
    console.log(`   ❌ Not found in cache: ${notFoundInCache}`);
    console.log(
      `   📈 Cache hit rate: ${((foundInCache / testQuestions.length) * 100).toFixed(1)}%`,
    );

    if (foundInCache === 0) {
      console.log("\n⚠️  NO CACHED DATA FOUND!");
      console.log("   This means either:");
      console.log("   1. The warm-cache script hasn't been run");
      console.log("   2. The cache keys don't match");
      console.log("   3. The cached data has expired");
      console.log("   4. Redis connection issues");
      console.log("\n💡 Try running: pnpm warm-cache");
    } else if (foundInCache === testQuestions.length) {
      console.log("\n🎉 ALL QUESTIONS FOUND IN CACHE!");
      console.log("   Your cache warming is working perfectly!");
    } else {
      console.log("\n🟡 PARTIAL CACHE COVERAGE");
      console.log("   Some questions are cached, others are not.");
      console.log("   This might be normal if warm-cache had some errors.");
    }

    // Test a manual cache operation
    console.log("\n🧪 Testing manual cache operations...");
    const testKey = "test:cache:key";
    const testData = {
      message: "Hello from cache test!",
      timestamp: Date.now(),
    };

    // Set test data
    await redisClient.set(testKey, JSON.stringify(testData), { EX: 60 });
    console.log("✅ Set test data in cache");

    // Get test data
    const retrievedData = await redisClient.get(testKey);
    if (retrievedData) {
      const parsed = JSON.parse(retrievedData);
      console.log("✅ Retrieved test data:", parsed.message);
    }

    // Clean up test data
    await redisClient.del(testKey);
    console.log("✅ Cleaned up test data");
  } catch (error) {
    console.error("❌ Cache test failed:", error);
  } finally {
    // Close Redis connection
    if (redisClient.isOpen) {
      await redisClient.disconnect();
      console.log("\n👋 Disconnected from Redis");
    }
  }
}

// Run the test
testCache()
  .then(() => {
    console.log("\n✨ Cache test completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Cache test failed:", error);
    process.exit(1);
  });
