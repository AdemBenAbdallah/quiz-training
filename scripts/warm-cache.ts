import dotenv from "dotenv";

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
import { certificateLevels } from "../public/quiz";

const redisClient: RedisClientType = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 6379,
    tls: true,
  },
});

redisClient.on("error", (err: Error) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("ready", () => {
  console.log("Redis Client Ready");
});

redisClient.on("connect", () => {
  console.log("Redis Client Connected");
});

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

  const cleanedChoices = cleanOptions(choices);

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
  console.log("Starting cache warming for all certificates...");

  try {
    if (!redisClient.isOpen) {
      console.log("Connecting to Redis...");
      await redisClient.connect();
    }
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    console.log("Redis Configuration:");
    console.log(`   Host: ${process.env.REDIS_HOST || "NOT SET"}`);
    console.log(
      `   Password: ${process.env.REDIS_PASSWORD ? "SET" : "NOT SET"}`,
    );
    process.exit(1);
  }

  let totalQuestions = 0;
  let totalLevels = 0;
  let cachedQuestions = 0;
  let generatedQuestions = 0;
  let errorQuestions = 0;

  const certificateEntries = Object.entries(certificateLevels);

  for (const [certSlug, levels] of certificateEntries) {
    for (const level of levels) {
      totalQuestions += level.length;
      totalLevels++;
    }
  }

  console.log(
    `Found ${totalQuestions} total questions across ${totalLevels} levels in ${certificateEntries.length} certificates`,
  );

  for (const [certSlug, levels] of certificateEntries) {
    for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
      const level = levels[levelIndex];
      const levelNum = levelIndex + 1;

      console.log(
        `\nProcessing ${certSlug} - Level ${levelNum} (${level.length} questions)...`,
      );

      for (let questionIndex = 0; questionIndex < level.length; questionIndex++) {
        const question = level[questionIndex] as QuizQuestion;
        const questionNum = questionIndex + 1;

        try {
          const { cacheKey } = processQuestionForCache(question);

          const cachedResponse = await getCachedData(cacheKey);

          if (cachedResponse) {
            console.log(
              `  ${certSlug} L${levelNum} Q${questionNum}: Already cached`,
            );
            cachedQuestions++;
            continue;
          }

          console.log(
            `  ${certSlug} L${levelNum} Q${questionNum}: Generating explanation...`,
          );
          const explanation = await generateExplanation(question);

          await setCachedData(cacheKey, explanation, 30);

          console.log(
            `  ${certSlug} L${levelNum} Q${questionNum}: Cached successfully`,
          );
          generatedQuestions++;

          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (error) {
          console.error(
            `  ${certSlug} L${levelNum} Q${questionNum}: Error -`,
            error,
          );
          errorQuestions++;
          continue;
        }
      }
    }
  }

  try {
    if (redisClient.isOpen) {
      await redisClient.disconnect();
      console.log("Redis connection closed");
    }
  } catch (error) {
    console.error("Error closing Redis connection:", error);
  }

  console.log("\nCache warming completed!");
  console.log(`Results:`);
  console.log(`   Total questions: ${totalQuestions}`);
  console.log(`   Already cached: ${cachedQuestions}`);
  console.log(`   Newly generated: ${generatedQuestions}`);
  console.log(`   Errors: ${errorQuestions}`);

  if (errorQuestions > 0) {
    console.log(
      `\n${errorQuestions} questions failed to process. Check the errors above for details.`,
    );
    process.exit(1);
  } else {
    console.log(`All questions processed successfully!`);
  }
}

warmCache()
  .then(() => {
    console.log("Cache warming script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Cache warming script failed:", error);
    process.exit(1);
  });
