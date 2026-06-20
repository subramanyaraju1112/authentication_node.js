import User from "../models/auth.model";

interface SignupUserInput {
    username: string;
    email: string;
    password: string;
}

const signupUser = async ({ username, email, password }: SignupUserInput) => {
    const existingUser = await User.findOne({ username, email });
    if (existingUser) {
        throw new Error("User Already Exists")
    }
}

export default signupUser;