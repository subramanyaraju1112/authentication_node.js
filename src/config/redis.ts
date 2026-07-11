import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL,
})

redisClient.on("connect", () => {
    console.log("Redis connected")
})

redisClient.on("ready", () => {
    console.log("Redis Ready");
});

redisClient.on("error", (error) => {
    console.error("Error connecting to Redis", error)
})

redisClient.on("end", () => {
    console.log("Redis Connection Closed");
});

export default redisClient;