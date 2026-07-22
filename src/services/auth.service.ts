import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import comparePassword from "../utils/comparePassword";
import generateOtp from "../utils/generateOtp";
import hashPassword from "../utils/hashPassword";
import { sendOtpEmail } from "./email.service";
import generateRefreshToken from "../utils/generateRefreshToken";
import generateAccessToken from "../utils/generateAccessToken";
import RefreshToken from "../models/refreshToken.model";
import redisClient from "../config/redis";
import { redisKeys } from "../utils/redisKeys";
import { checkLoginAttempts, incrementAttempts, resetAttempts } from "./rateLimiter.service";
import { ConflictError } from "../errors/ConflictError";
import { NotFoundError } from "../errors/NotFoundError";
import { BadRequestError } from "../errors/BadRequestError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

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
    ip: string;
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
        throw new ConflictError("User already exists")
    }

    const otp = generateOtp();

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
    })

    await redisClient.set(redisKeys.otp(email), otp, { EX: 600 });

    await sendOtpEmail({ email, otp });

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified
    };
}

const signinUser = async ({ email, ip, password }: SigninUserInput) => {

    await checkLoginAttempts({ email, ip });

    const user = await User.findOne({ email });

    if (!user) {
        await incrementAttempts({ email, ip });
        throw new UnauthorizedError("Invalid credentials")
    }

    if (!user.isVerified) {
        await incrementAttempts({ email, ip });
        throw new ForbiddenError("Please verify your email first")
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        await incrementAttempts({ email, ip });

        throw new UnauthorizedError("Invalid credentials")
    }

    await resetAttempts({ email, ip });

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
        throw new NotFoundError("User not found")
    }

    if (user.isVerified) {
        throw new ConflictError("User already verified")
    }

    const storedOtp = await redisClient.get(redisKeys.otp(email));

    if (!storedOtp) {
        throw new BadRequestError("OTP Expired");
    }

    if (storedOtp !== otp) {
        throw new BadRequestError(" Incorrect OTP");
    }

    await redisClient.del(redisKeys.otp(email));
    user.isVerified = true;

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
        throw new NotFoundError("User not found")
    }

    if (user.isVerified) {
        throw new ConflictError("User already verified")
    }

    const newOtp = generateOtp();

    await redisClient.set(redisKeys.otp(email), newOtp, { EX: 600 })

    await sendOtpEmail({ email, otp: newOtp });

    return true;
}

const forgotPassword = async ({ email }: forgotPasswordInput) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new NotFoundError("User not found")
    }

    if (!user.isVerified) {
        throw new ForbiddenError("Please verify your email first");
    }

    const otp = generateOtp();

    await redisClient.set(redisKeys.passwordResetOtp(email), otp, { EX: 600 });

    await sendOtpEmail({ email, otp });

    return true;
}

const resetPassword = async ({ email, otp, password, confirmPassword }: resetPasswordInput) => {

    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError("User not found")
    }

    const storedOtp = await redisClient.get(redisKeys.passwordResetOtp(email));

    if (!storedOtp) {
        throw new BadRequestError("OTP expired");
    }

    if (storedOtp !== otp) {
        throw new BadRequestError("Incorrect OTP");
    }

    if (password !== confirmPassword) {
        throw new BadRequestError("Password doesn't match");
    }

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    await user.save();

    await redisClient.del(redisKeys.passwordResetOtp(email));

    await RefreshToken.deleteMany({
        userId: user._id,
    });

    return {
        message: "Password reset successful"
    };
}

const refreshAccessToken = async ({ token }: refreshTokenInput) => {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
        throw new Error("JWT REFRESH SECRET KEY not found")
    }

    const decoded = jwt.verify(token, secret) as AuthPayload;
    const userId = decoded.userId;
    const findToken = await RefreshToken.findOne({ token });

    if (!findToken) {
        throw new UnauthorizedError("Invalid refresh token")
    }

    if (findToken.revoked) {
        throw new UnauthorizedError("Refresh Token is revoked")
    }

    if (Date.now() > findToken.expiresAt.getTime()) {
        throw new UnauthorizedError("Refresh Token Expired")
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

const logout = async ({ token }: refreshTokenInput) => {
    const findToken = await RefreshToken.findOne({ token });

    if (!findToken) {
        throw new NotFoundError("Refresh Token not found")
    }

    await findToken.deleteOne();
    return true;
}

export { signupUser, signinUser, verifyOtp, resendOtp, forgotPassword, resetPassword, refreshAccessToken, logout };