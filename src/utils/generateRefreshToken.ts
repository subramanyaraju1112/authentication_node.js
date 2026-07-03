import jwt, { SignOptions } from "jsonwebtoken";

const generateRefreshToken = (userId: string) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    const tokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN;

    if (!secret) {
        throw new Error("JWT_REFRESH_SECRET_KEY is not defined")
    }
    if (!tokenExpiry) {
        throw new Error("JWT_REFRESH_TOKEN_EXPIRY is not defined")
    }
    return jwt.sign({ userId }, secret, { expiresIn: tokenExpiry as SignOptions["expiresIn"] })
}

export default generateRefreshToken;