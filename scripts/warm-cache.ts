import dotenv from "dotenv";

// Load environment variables FIRST before importing any modules that use Redis
dotenv.config();

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { createClient, type RedisClientType } from "redis";
import { explainSchema } from "../app/api/explain-question/schemas";
import {
  QuizQuestion,
  cleanOptions,
  processQuestionForCache,
} from "../lib/explain-utils";
import { quizLevels } from "../public/quiz";

// Create our own Redis client with proper env loading
const redisClient: RedisClientType = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 6379,
    tls: true,
  },
});

// Handle Redis events
redisClient.on("error", (err: Error) => {
  console.error("🚨 Redis Client Error:", err);
});

redisClient.on("ready", () => {
  console.log("✨ Redis Client Ready");
});

redisClient.on("connect", () => {
  console.log("🔌 Redis Client Connected");
});

// Custom cache functions using our client
async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
}

async function setCachedData(
  key: string,
  data: any,
  expirationDays?: number,
): Promise<void> {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    if (expirationDays && expirationDays > 0) {
      const expirationSeconds = expirationDays * 86400;
      await redisClient.set(key, JSON.stringify(data), {
        EX: expirationSeconds,
      });
    } else {
      await redisClient.set(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error("Redis set error:", error);
  }
}

async function generateExplanation(question: QuizQuestion) {
  const { question: questionText, choices, answers } = question;

  // Use shared utility to clean choices
  const cleanedChoices = cleanOptions(choices);

  // Create prompt for structured output
  const answerLabels = ["A", "B", "C", "D", "E"];
  const prompt = `You are a helpful assistant for beginners. Given the following multiple-choice question, explain the question, each choice, and why the correct answer is correct in a beginner-friendly way. Also, provide a short actionable trick or tip for answering this type of question in the future.

Question: ${questionText}
Choices:
${cleanedChoices.map((opt: string, i: number) => `${answerLabels[i]}. ${opt}`).join("\n")}
Correct Answer: ${answers}`;

  const result = await generateObject({
    model: google("gemini-flash-latest"),
    schema: explainSchema,
    prompt,
  });

  return result.object;
}

async function warmCache() {
  console.log("🚀 Starting cache warming for quiz questions...");

  // Connect to Redis first
  try {
    if (!redisClient.isOpen) {
      console.log("🔌 Connecting to Redis...");
      await redisClient.connect();
    }
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
    console.log("📋 Redis Configuration:");
    console.log(`   Host: ${process.env.REDIS_HOST || "NOT SET"}`);
    console.log(
      `   Password: ${process.env.REDIS_PASSWORD ? "SET" : "NOT SET"}`,
    );
    process.exit(1);
  }

  let totalQuestions = 0;
  let cachedQuestions = 0;
  let generatedQuestions = 0;
  let errorQuestions = 0;

  // Count total questions first
  for (const level of quizLevels) {
    totalQuestions += level.length;
  }

  console.log(
    `📊 Found ${totalQuestions} total questions across ${quizLevels.length} levels`,
  );

  for (let levelIndex = 0; levelIndex < quizLevels.length; levelIndex++) {
    const level = quizLevels[levelIndex];
    const levelNum = levelIndex + 1;

    console.log(
      `\n📚 Processing Level ${levelNum} (${level.length} questions)...`,
    );

    for (let questionIndex = 0; questionIndex < level.length; questionIndex++) {
      const question = level[questionIndex] as QuizQuestion;
      const questionNum = questionIndex + 1;

      try {
        // Use shared utility to process question for cache
        const { cacheKey, cleanedOptions } = processQuestionForCache(question);

        // Check if explanation already exists in cache
        const cachedResponse = await getCachedData(cacheKey);

        if (cachedResponse) {
          console.log(`✅ Level ${levelNum}, Q${questionNum}: Already cached`);
          cachedQuestions++;
          continue;
        }

        // Generate explanation
        console.log(
          `🔄 Level ${levelNum}, Q${questionNum}: Generating explanation...`,
        );
        const explanation = await generateExplanation(question);

        // Cache the explanation (30 days expiration)
        await setCachedData(cacheKey, explanation, 30);

        console.log(
          `💾 Level ${levelNum}, Q${questionNum}: Cached successfully`,
        );
        generatedQuestions++;

        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`❌ Level ${levelNum}, Q${questionNum}: Error -`, error);
        errorQuestions++;
        continue;
      }
    }
  }

  // Close Redis connection
  try {
    if (redisClient.isOpen) {
      await redisClient.disconnect();
      console.log("👋 Redis connection closed");
    }
  } catch (error) {
    console.error("Error closing Redis connection:", error);
  }

  console.log("\n🎉 Cache warming completed!");
  console.log(`📈 Results:`);
  console.log(`   • Total questions: ${totalQuestions}`);
  console.log(`   • Already cached: ${cachedQuestions}`);
  console.log(`   • Newly generated: ${generatedQuestions}`);
  console.log(`   • Errors: ${errorQuestions}`);

  if (errorQuestions > 0) {
    console.log(
      `\n⚠️  ${errorQuestions} questions failed to process. Check the errors above for details.`,
    );
    process.exit(1);
  } else {
    console.log(`\n✅ All questions processed successfully!`);
  }
}

// Run the script
warmCache()
  .then(() => {
    console.log("✨ Cache warming script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Cache warming script failed:", error);
    process.exit(1);
  });
