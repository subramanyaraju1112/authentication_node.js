export const redisKeys = {
    otp: (email: string) => `otp:${email}`,

    passwordResetOtp: (email: string) => `password-reset:${email}`,

    loginAttempts: (email: string) => `login:attempts:${email}`,

    loginLock: (email: string) => `login:lock${email}`
};
