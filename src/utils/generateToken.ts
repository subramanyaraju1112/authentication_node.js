import jwt from "jsonwebtoken"

const generateToken = (userId: string, email: string): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined")
    }
    return jwt.sign({ userId, email }, secret, { expiresIn: "1d" });
}

export default generateToken;