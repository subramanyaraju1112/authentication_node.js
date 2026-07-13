export const redisKeys = {
    otp: (email: string) => `otp:${email}`,

    loginAttempts: (email: string) => `login:attempts:${email}`,

    loginLock: (email: string) => `login:lock${email}`
};
