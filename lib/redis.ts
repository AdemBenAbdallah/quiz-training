import type { RedisClientType } from "redis";
import { createClient } from "redis";

// Create Redis client with type annotation
const client: RedisClientType = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 15487,
  },
});

// Handle Redis events with proper error typing
client.on("error", (err: Error) => {
  console.error("🚨 Redis Client Error:", err);
});

client.on("ready", () => {
  console.log("✨ Redis Client Ready");
});

client.on("connect", () => {
  console.log("🔌 Redis Client Connected");
});

client.on("disconnect", () => {
  console.log("❌ Redis Client Disconnected");
});

client.on("reconnecting", () => {
  console.log("🔄 Redis Client Reconnecting...");
});

// Connect to Redis when the module is imported
client.connect().catch(console.error);

export default client;
