import User from "../models/user.model";
import generateOtp from "../utils/generateOtp";
import hashPassword from "../utils/hashPassword";

interface SignupUserInput {
    username: string;
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

export default signupUser;