import dotenv from "dotenv";
dotenv.config();
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redis;


// import { createClient } from "redis";

// console.log("ENV CHECK:", {
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT
// })
// const redis = createClient({
//   username: process.env.REDIS_USERNAME,
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//     host: process.env.REDIS_HOST,
//     port: 14285,
//     // tls: true,
//   },
// });

// redis.on("connect", () => {
//   console.log("Connected to Redis");
// });

// redis.on("error", (err) => console.log("Redis Client Error", err));

// export default redis;
