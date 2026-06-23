import User from "../models/user.model";
import comparePassword from "../utils/comparePassword";
import generateOtp from "../utils/generateOtp";
import generateToken from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";

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
    otp: string;
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

    const token = generateToken(user._id.toString(), user.email)

    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        token
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

export { signupUser, signinUser, verifyOtp };