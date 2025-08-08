import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

async function testRedisConnection() {
  // Create Redis client with configuration
  const client = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: 15487,
    },
  });

  try {
    client.on("error", (err: Error) =>
      console.error("Redis Client Error:", err),
    );
    client.on("ready", () => console.log("✨ Redis Client Ready"));
    client.on("connect", () => console.log("🔌 Redis Client Connected"));
    client.on("disconnect", () => console.log("❌ Redis Client Disconnected"));
    client.on("reconnecting", () =>
      console.log("🔄 Redis Client Reconnecting..."),
    );

    // Connect to Redis
    console.log("\n🔄 Connecting to Redis...");
    await client.connect();

    // Test basic operations
    console.log("\n🧪 Testing Redis operations:");

    // Test 1: Set a value
    console.log("\n1️⃣ Testing SET operation...");
    await client.set("test-key", "Hello from Redis!");
    console.log("✅ SET operation successful");

    // Test 2: Get the value
    console.log("\n2️⃣ Testing GET operation...");
    const value = await client.get("test-key");
    console.log("📝 Retrieved value:", value);
    console.log("✅ GET operation successful");

    // Test 3: Delete the value
    console.log("\n3️⃣ Testing DEL operation...");
    await client.del("test-key");
    const deletedValue = await client.get("test-key");
    console.log("📝 Value after deletion:", deletedValue);
    console.log("✅ DEL operation successful");

    console.log("\n🎉 All Redis operations completed successfully!");
  } catch (error) {
    console.error("❌ Redis Test Failed:", error);
    process.exit(1);
  } finally {
    // Clean up
    await client.quit();
    console.log("\n👋 Redis connection closed");
  }
}

// Run the test
console.log("🚀 Starting Redis connection test...");
testRedisConnection().catch((error: Error) => {
  console.error("❌ Unhandled error:", error);
  process.exit(1);
});
