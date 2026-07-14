import { NextFunction } from "express";
import redisClient from "../config/redis";
import { redisKeys } from "../utils/redisKeys";

interface rateLimitInput {
    email: string;
    ip: string;
}

export const checkLimit = async ({email, ip}: rateLimitInput) => {

const attempts = await redisClient.get(redisKeys.loginAttempts(email, ip));

const counts = Number(attempts ?? 0);
if(attempts >=5){
    return res.status(429).json({
        success: false,
        message: "Too many login attempts. Try again after 15 minutes."
    })
}
next();
}

export const incrementAttempt = async ({email, ip}: rateLimitInput) => {

}

export const resetAttempts = async({email, ip}: rateLimitInput) => {
    
}


