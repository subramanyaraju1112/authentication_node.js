import redisClient from "../config/redis";
import { redisKeys } from "./redisKeys";
import {
    LOGIN_LOCK_TIME,
    MAX_LOGIN_ATTEMPTS,
} from "../constants/auth.constants";

export const isLoginLocked = async (email: string) => {
    const locked = await redisClient.exists(redisKeys.loginLock(email));
    return locked === 1;
}

export const recordFailedLogin = async (email: string) => {
    const attemptsKey = redisKeys.loginAttempts(email);
    const lockKey = redisKeys.loginLock(email);
    const attempts = await redisClient.incr(attemptsKey);

    if (attempts === 1) {
        await redisClient.expire(attemptsKey, LOGIN_LOCK_TIME)
    }

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
        await redisClient.set(lockKey, "LOCKED", {
            EX: LOGIN_LOCK_TIME,
        })
    }

    return {
        attempts,
        locked: attempts >= MAX_LOGIN_ATTEMPTS,
        remainingAttempts: Math.max(0, MAX_LOGIN_ATTEMPTS - attempts),
    };
}

export const resetLoginAttempts = async (email: string) => {
    await redisClient.del([
        redisKeys.loginAttempts(email),
        redisKeys.loginLock(email)
    ]);
}