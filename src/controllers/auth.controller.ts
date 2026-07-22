import { forgotPassword, logout, refreshAccessToken, resendOtp, resetPassword, signinUser, signupUser, verifyOtp } from "../services/auth.service";
import asyncHandler from "../utils/asyncHandler";

const signupController = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const user = await signupUser({ username, email, password });
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user
    })
});

const signinController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
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
    await resendOtp({ email });
    res.status(200).json({
        success: true,
        message: "OTP sent successfully"
    })
});

const forgotPasswordController = asyncHandler(async (req, res) => {
    const { email } = req.body;
    await forgotPassword({ email });
    res.status(200).json({
        success: true,
        message: "Password reset OTP sent successfully"
    })
});

const resetPasswordController = asyncHandler(async (req, res) => {
    const { email, otp, password, confirmPassword } = req.body;
    await resetPassword({ email, otp, password, confirmPassword });
    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    })
});

const refreshTokenController = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const tokens = await refreshAccessToken({ token });
    res.status(200).json({
        success: true,
        message: "Refresh token generated successfully",
        data: tokens
    })
});

const logoutController = asyncHandler(async (req, res) => {
    const { token } = req.body;
    await logout({ token });
    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    })
});


export { signupController, signinController, verifyOtpController, resendOtpController, forgotPasswordController, resetPasswordController, refreshTokenController, logoutController };