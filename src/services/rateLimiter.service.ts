import redisClient from "../config/redis";
import {
  LOGIN_LOCK_TIME,
  MAX_LOGIN_ATTEMPTS,
} from "../constants/auth.constants";
import { TooManyRequestsError } from "../errors/TooManyRequestsError";
import { redisKeys } from "../utils/redisKeys";

interface RateLimitInput {
  email: string;
  ip: string;
}

export const checkLoginAttempts = async ({ email, ip }: RateLimitInput): Promise<void> => {
  const attempts = await redisClient.get(redisKeys.loginAttempts(email, ip));
  const count = Number(attempts ?? 0);

  if (count >= MAX_LOGIN_ATTEMPTS) {
    throw new TooManyRequestsError("Too many login attempts. Try again after 15 minutes.");
  }
};

export const incrementAttempts = async ({ email, ip }: RateLimitInput): Promise<number> => {
  const key = redisKeys.loginAttempts(email, ip);
  const count = await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(key, LOGIN_LOCK_TIME);
  }
  return count;
};

export const resetAttempts = async ({ email, ip }: RateLimitInput): Promise<void> => {
  const key = redisKeys.loginAttempts(email, ip);
  await redisClient.del(key);
};
