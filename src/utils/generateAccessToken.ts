import jwt, { SignOptions } from "jsonwebtoken"

const generateAccessToken = (userId: string) => {
    const secret = process.env.JWT_ACCESS_SECRET;
    const tokenExpiry = process.env.JWT_ACCESS_EXPIRES_IN;
    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not defined")
    }
    if (!tokenExpiry) {
        throw new Error("JWT_ACCESS_EXPIRY is not defined")
    }
    return jwt.sign({ userId }, secret, { expiresIn: tokenExpiry as SignOptions["expiresIn"] });
}

export default generateAccessToken;