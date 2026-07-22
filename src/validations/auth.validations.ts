import { z } from "zod";

export const signupSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username cannot exceed 50 characters"),

    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password cannot exceed 100 characters"),
});

export const signinSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    password: z
        .string()
        .min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    otp: z
        .string()
        .length(6, "OTP must be exactly 6 digits"),
});

export const resendOtpSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address"),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address"),
});

export const resetPasswordSchema = z
    .object({
        email: z
            .string()
            .trim()
            .email("Invalid email address"),

        otp: z
            .string()
            .length(6, "OTP must be exactly 6 digits"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z.string(),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

export const refreshTokenSchema = z.object({
    token: z
        .string()
        .min(1, "Refresh token is required"),
});

export const logoutSchema = z.object({
    token: z
        .string()
        .min(1, "Refresh token is required"),
});