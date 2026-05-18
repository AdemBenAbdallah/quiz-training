import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

async function testRedisConnection() {
  const redisUrl = process.env.REDIS_URL;
  const redisHost = process.env.REDIS_HOST;
  const redisPassword = process.env.REDIS_PASSWORD;

  const hasRedisUrl = redisUrl !== undefined && redisUrl !== "";
  const hasRedisHost = redisHost !== undefined && redisHost !== "";
  const hasRedisPassword = redisPassword !== undefined && redisPassword !== "";

  if (hasRedisUrl === false && (hasRedisHost === false || hasRedisPassword === false)) {
    throw new Error(
      "Missing Redis configuration. Set REDIS_URL or REDIS_HOST + REDIS_PASSWORD in your environment.",
    );
  }

  const client = hasRedisUrl
    ? createClient({ url: redisUrl })
    : createClient({
        username: "default",
        password: redisPassword,
        socket: {
          host: redisHost,
          port: 6379,
          tls: true,
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

    console.log("\n🔄 Connecting to Redis...");
    await client.connect();

    console.log("\n🧪 Testing Redis operations:");

    console.log("\n1️⃣ Testing SET operation...");
    await client.set("test-key", "Hello from Redis!");
    console.log("✅ SET operation successful");

    console.log("\n2️⃣ Testing GET operation...");
    const value = await client.get("test-key");
    console.log("📝 Retrieved value:", value);
    console.log("✅ GET operation successful");

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
    await client.quit();
    console.log("\n👋 Redis connection closed");
  }
}

console.log("🚀 Starting Redis connection test...");
testRedisConnection().catch((error: Error) => {
  console.error("❌ Unhandled error:", error);
  process.exit(1);
});
