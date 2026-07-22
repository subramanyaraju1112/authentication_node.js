import { forgotPassword, logout, refreshAccessToken, resendOtp, resetPassword, signinUser, signupUser, verifyOtp } from "../services/auth.service";
import { BadRequestError } from "../errors/BadRequestError";
import asyncHandler from "../utils/asyncHandler";

const signupController = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new BadRequestError("All fields are required")
    }

    const user = await signupUser({ username, email, password });
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user
    })
});

const signinController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("All fields are required");
    }
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const user = await signinUser({ ip, email, password });
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: user
    })
});

const verifyOtpController = asyncHandler(async (req, res) => {
    const { email, otp } = req.body
    if (!email || !otp) {
        throw new BadRequestError("Email & OTP are required");
    }

    const user = await verifyOtp({ email, otp });
    res.status(200).json({
        success: true,
        message: "User verified successfully",
        data: {
            id: user.id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified
        }
    })
});

const resendOtpController = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new BadRequestError("Email is required")
    }

    await resendOtp({ email });
    res.status(200).json({
        success: true,
        message: "OTP sent successfully"
    })
});

const forgotPasswordController = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new BadRequestError("Email is required")
    }

    await forgotPassword({ email });
    res.status(200).json({
        success: true,
        message: "Password reset OTP sent successfully"
    })
});

const resetPasswordController = asyncHandler(async (req, res) => {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
        throw new BadRequestError("All fields are required")
    }
    await resetPassword({ email, otp, password, confirmPassword });
    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    })
});

const refreshTokenController = asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        throw new BadRequestError("Refresh token is required")
    }

    const tokens = await refreshAccessToken({ token });
    res.status(200).json({
        success: true,
        message: "Refresh token generated sucessfully",
        data: tokens
    })
});

const logoutController = asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        throw new BadRequestError("Refresh token is required")
    }
    await logout({ token });
    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    })
});


export { signupController, signinController, verifyOtpController, resendOtpController, forgotPasswordController, resetPasswordController, refreshTokenController, logoutController };