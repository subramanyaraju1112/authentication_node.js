import { NextFunction, Request, Response } from "express";
import { forgotPassword, logout, refreshAccessToken, resendOtp, resetPassword, signinUser, signupUser, verifyOtp } from "../services/auth.service";
import { BadRequestError } from "../errors/BadRequestError";

const signupController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            throw new BadRequestError("All fields are required")
        }

        const user = await signupUser({ username, email, password });
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        })
    }
    catch (error) {
        next(error)
    }
}

const signinController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new BadRequestError("All fields are required");
        }
        const ip = req.ip || req.socket.remoteAddress || "unknown";
        const user = await signinUser({ ip, email, password });
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: user
        })

    } catch (error) {
        next(error)
    }
}

const verifyOtpController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp) {
            throw new BadRequestError("Email & OTP are required");
        }

        const user = await verifyOtp({ email, otp });
        return res.status(200).json({
            success: true,
            message: "User verified successfully",
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified
            }

        })
    } catch (error) {
        next(error)
    }
}

const resendOtpController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new BadRequestError("Email is required")
        }

        await resendOtp({ email });
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        })

    } catch (error) {
        next(error)
    }
}

const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new BadRequestError("Email is required")
        }

        await forgotPassword({ email });
        return res.status(200).json({
            success: true,
            message: "Password reset OTP sent successfully"
        })

    } catch (error) {
        next(error)
    }
}

const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, password, confirmPassword } = req.body;

        if (!email || !otp || !password || !confirmPassword) {
            throw new BadRequestError("All fields are required")
        }
        await resetPassword({ email, otp, password, confirmPassword });
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (error) {
        next(error)
    }
}

const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        if (!token) {
            throw new BadRequestError("Token not found")
        }

        const tokens = await refreshAccessToken({ token });
        return res.status(200).json({
            success: true,
            message: "Refresh Token generated sucessfully",
            data: tokens
        })

    } catch (error) {
        next(error)
    }
}

const logoutController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        if (!token) {
            throw new BadRequestError("Token not found")
        }
        await logout({ token });
        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    } catch (error) {
        next(error)
    }
}


export { signupController, signinController, verifyOtpController, resendOtpController, forgotPasswordController, resetPasswordController, refreshTokenController, logoutController };