import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";

dotenv.config();

let redisClient: RedisClientType | null = null;

export const getRedisClient = async (): Promise<RedisClientType> => {
  if (!redisClient) {
    try {
      // console.log("Connecting to Redis...");
      redisClient = createClient({
        url: process.env.REDIS_CONNECTION,
      });

      redisClient.on("error", (error: Error) => {
        console.error(`Error in Redis connection: ${error.message}`);
      });

      await redisClient.connect();
      console.log("Redis connected successfully!");
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  return redisClient;
};
getRedisClient()
export default redisClient



