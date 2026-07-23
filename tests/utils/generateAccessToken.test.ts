import jwt from "jsonwebtoken";
import generateAccessToken from "../../src/utils/generateAccessToken";

describe("generateAccessToken", () => {
    beforeAll(() => {
        process.env.JWT_ACCESS_SECRET = "test-secret";
    });

    test("should return JWT Token", async () => {
        const token = generateAccessToken("123")
        expect(typeof token).toBe("string");
    })

    test("should contain the correct user id", async () => {
        const token = generateAccessToken("123");

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as jwt.JwtPayload;
        expect(decoded.userId).toBe("123");
    })

    test("should have expiration time", async () => {
        const token = generateAccessToken("123");

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as jwt.JwtPayload;
        expect(decoded.exp).toBeDefined();
    })

    test("should fail verification with an invalid secret", async () => {
        const token = generateAccessToken("123");

        expect(() => { jwt.verify(token, "wrong-secret") }).toThrow();
    })
})