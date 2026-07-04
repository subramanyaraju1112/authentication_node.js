import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import comparePassword from "../utils/comparePassword";
import generateOtp from "../utils/generateOtp";
import hashPassword from "../utils/hashPassword";
import { sendOtpEmail } from "./email.service";
import generateRefreshToken from "../utils/generateRefreshToken";
import generateAccessToken from "../utils/generateAccessToken";
import RefreshToken from "../models/refreshToken.model";

interface AuthPayload extends JwtPayload {
    userId: string;
}
interface SignupUserInput {
    username: string;
    email: string;
    password: string;
}
interface SigninUserInput {
    email: string;
    password: string;
}
interface verifyUserInput {
    email: string;
    otp?: string;
}

interface forgotPasswordInput {
    email: string;
}

interface resetPasswordInput {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
}

interface refreshTokenInput {
    token: string;
}

const signupUser = async ({ username, email, password }: SignupUserInput) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User Already Exists")
    }

    const otp = generateOtp();

    const hashedPassword = await hashPassword(password);

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
        isVerified: false,
    })

    await sendOtpEmail({ email, otp });

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified
    };
}

const signinUser = async ({ email, password }: SigninUserInput) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid credentials")
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid credentials")
    }

    if (!user.isVerified) {
        throw new Error("Please verify your email first")
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString())

    const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt
    })

    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        accessToken,
        refreshToken
    }
}

const verifyOtp = async ({ email, otp }: verifyUserInput) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found")
    }

    if (user.isVerified) {
        throw new Error("User already verified")
    }

    if (user.otp !== otp) {
        throw new Error("Incorrect OTP")
    }

    if (!user.otpExpiry) {
        throw new Error("OTP expiry not found");
    }

    if (Date.now() > user.otpExpiry.getTime()) {
        throw new Error("OTP expired")
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
    }

}

const resendOtp = async ({ email }: verifyUserInput) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found")
    }

    if (user.isVerified) {
        throw new Error("User already verified")
    }

    const newOtp = generateOtp();

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = newOtp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOtpEmail({ email, otp: newOtp });

    return true;
}

const forgotPassword = async ({ email }: forgotPasswordInput) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found")
    }

    const otp = generateOtp();

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    await sendOtpEmail({ email, otp });

    return true;
}

const resetPassword = async ({ email, otp, password, confirmPassword }: resetPasswordInput) => {

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found")
    }

    if (user.otp !== otp) {
        throw new Error("Incorrect OTP")
    }

    if (!user.otpExpiry) {
        throw new Error("OTP expiry not found");
    }

    if (Date.now() > user.otpExpiry.getTime()) {
        throw new Error("OTP expired")
    }

    if (password !== confirmPassword) {
        throw new Error("Password doesn't match")
    }

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save()

    return {
        message: "Password reset successfull"
    };
}

const refreshToken = async ({ token }: refreshTokenInput) => {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
        throw new Error("JWT REFRESH SECRET KEY not found")
    }

    const decoded = jwt.verify(token, secret) as AuthPayload;
    const userId = decoded.userId;
    const findToken = await RefreshToken.findOne({ token });

    if (!findToken) {
        throw new Error("Refresh Token not found")
    }

    if (findToken.revoked) {
        throw new Error("Refresh Token is revoked")
    }

    if (Date.now() > findToken.expiresAt.getTime()) {
        throw new Error("Refresh Token Expired")
    }

    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    findToken.token = newRefreshToken;
        findToken.expiresAt = expiry;
        await findToken.save();

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }
}

const logout = async () => {
    return true;
}

export { signupUser, signinUser, verifyOtp, resendOtp, forgotPassword, resetPassword, refreshToken, logout };