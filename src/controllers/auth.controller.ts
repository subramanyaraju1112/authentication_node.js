import { Request, Response } from "express";
import { resendOtp, signinUser, signupUser, verifyOtp } from "../services/auth.service";

const signupController = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await signupUser({ username, email, password });
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal server error"
        })
    }

}

const signinController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await signinUser({ email, password });
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: user
        })

    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "Invalid credentials"
        ) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        if (
            error instanceof Error &&
            error.message === "Please verify your email first"
        ) {
            return res.status(403).json({
                success: false,
                message: error.message,
                isVerified: false
            });
        }

        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal server error"
        });
    }
}

const verifyOtpController = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            })
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
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal server error"
        })
    }
}

const resendOtpController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        await resendOtp({ email });
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal server error"
        })
    }
}


export { signupController, signinController, verifyOtpController, resendOtpController };