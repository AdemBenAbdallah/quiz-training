import { removeCachedData } from "../lib/redis-cache.js"; // Explicit .js extension
import dotenv from "dotenv";
dotenv.config();

// Function to generate the cache key, mirroring the logic in the API route
function generateCacheKey(question: string, options: string[]): string {
  const normalizedQuestion = question.toLowerCase().trim();
  const normalizedOptions = options.map((opt) => opt.toLowerCase().trim());

  return `service:${Buffer.from(
    JSON.stringify({
      q: normalizedQuestion,
      o: normalizedOptions,
    }),
  ).toString("base64")}`;
}

async function clearServiceInfoCache(question: string, options: string[]) {
  const cacheKey = generateCacheKey(question, options);
  console.log(`Attempting to remove cache for key: ${cacheKey}`);

  try {
    const deletedCount = await removeCachedData(cacheKey);
    if (deletedCount > 0) {
      console.log(
        `✅ Successfully removed cached data for question: "${question}"`,
      );
    } else {
      console.log(`❗ No cached data found for question: "${question}"`);
    }
  } catch (error) {
    console.error(`❌ Failed to remove cached data:`, error);
  } finally {
    // It's good practice to disconnect from Redis if the client
    // manages its own connection, though the 'redis' package
    // typically handles this internally or on process exit for scripts.
    // If you explicitly manage a connection, you might add client.disconnect() here.
  }
}

// Example usage:
// To run this script, use `ts-node scripts/clear-redis-cache.ts`
// You'll need to provide the exact question and options that were used
// to generate the cache entry.

// Example 1: Clear cache for a specific question and options
const exampleQuestion1 =
  "Which AWS service is best for highly scalable, relational databases?";
const exampleOptions1 = [
  "Amazon DynamoDB",
  "Amazon S3",
  "Amazon RDS",
  "Amazon EC2",
  "AWS Lambda",
];

// Uncomment the line below to run the example
// clearServiceInfoCache(exampleQuestion1, exampleOptions1);

// You can add more examples or modify this script to read inputs
// from command line arguments (e.g., using 'minimist' or 'yargs' npm packages)
// for more dynamic cache clearing.

// For now, let's make it runnable via ts-node directly
// You would manually update the question and options variables here
// to match the cache entry you want to clear.

// Example of how to integrate with a CLI (requires a package like 'yargs' or 'commander')
// import yargs from 'yargs';
// import { hideBin } from 'yargs/helpers';

// const argv = yargs(hideBin(process.argv))
//   .option('question', {
//     alias: 'q',
//     type: 'string',
//     description: 'The exact question string for which to clear the cache',
//     demandOption: true,
//   })
//   .option('options', {
//     alias: 'o',
//     type: 'array',
//     description: 'The exact options array (comma-separated) for which to clear the cache',
//     demandOption: true,
//     string: true,
//   })
//   .help()
//   .alias('h', 'help')
//   .argv as { question: string, options: string[] };

// // Make sure to cast the options from string[] to string[] if yargs parses them differently
// const optionsArray = argv.options.map(String);

// clearServiceInfoCache(argv.question, optionsArray);

// For a simple direct execution without a CLI library:
// You must set these variables before running the script
const questionToClear = process.env.CLEAR_QUESTION || "";
const optionsToClear = process.env.CLEAR_OPTIONS
  ? JSON.parse(process.env.CLEAR_OPTIONS)
  : [];

if (questionToClear && optionsToClear.length > 0) {
  clearServiceInfoCache(questionToClear, optionsToClear)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else {
  console.log(
    "Usage: Set CLEAR_QUESTION and CLEAR_OPTIONS environment variables.",
  );
  console.log(
    'Example: CLEAR_QUESTION="Which AWS service is best for highly scalable, relational databases?" CLEAR_OPTIONS=\'["Amazon DynamoDB", "Amazon S3", "Amazon RDS", "Amazon EC2", "AWS Lambda"]\' ts-node scripts/clear-redis-cache.ts',
  );
  process.exit(0);
}
