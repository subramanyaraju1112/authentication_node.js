export const redisKeys = {
    otp: (email: string) => `otp:${email}`,

    passwordResetOtp: (email: string) => `password-reset:${email}`,

    loginAttempts: (email: string, ip: string) => `login:attempts:${email}:${ip}`,

    loginLock: (email: string) => `login:lock${email}`
};
