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

    const token = generateToken(user._id.toString(), user.email)

    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        token
    }
}

export { signupUser, signinUser };