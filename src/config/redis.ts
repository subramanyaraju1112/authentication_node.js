import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL,
})

redisClient.on("connect", () => {
    console.log("Redis connected")
})

redisClient.on("error", (error) => {
    console.error("Error connecting to Redis")
})

export default redisClient;