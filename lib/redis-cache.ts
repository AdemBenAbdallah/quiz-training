import client from "./redis";

async function ensureConnection() {
  if (!client.isOpen) {
    try {
      await client.connect();
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    await ensureConnection();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis get error:", error);
    // Don't throw the error, return null to allow fallback to generation
    return null;
  }
}

export async function setCachedData(
  key: string,
  data: any,
  expirationDays: number = 30,
): Promise<void> {
  try {
    await ensureConnection();
    // Convert expiration days to seconds (86400 seconds in a day)
    const expirationSeconds = expirationDays * 86400;

    await client.set(key, JSON.stringify(data), {
      EX: expirationSeconds, // Set expiration time in seconds
    });
  } catch (error) {
    console.error("Redis set error:", error);
    // Don't throw the error, just log it
    // This way, even if caching fails, the API still works
  }
}

// Ensure Redis is connected when the module is imported
ensureConnection().catch(console.error);
