import jwt from "jsonwebtoken";
import generateRefreshToken from "../../src/utils/generateRefreshToken";

describe("generateRefreshToken", () => {
    beforeAll(() => {
        process.env.JWT_ACCESS_SECRET = "refresh-secret"
    });

    test("should return a JWT refresh token", async () => {
        const token = generateRefreshToken("123");
        expect(typeof token).toBe("string");
    });

    test("should contain the correct userId", async () => {
        const token = generateRefreshToken("123");

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as jwt.JwtPayload;
        expect(decoded.userId).toBe("123");
    });

    test("should include expiration", async () => {
        const token = generateRefreshToken("123");

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as jwt.JwtPayload;
        expect(decoded.exp).toBeDefined();
    });

    test("should fail verification with an invalid secret", async () => {
        const token = generateRefreshToken("123");

        expect(() => { jwt.verify(token, "wrong-secret") }).toThrow();
    });
})