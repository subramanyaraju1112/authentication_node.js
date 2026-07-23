import bcrypt from "bcryptjs";
import hashPassword from "../../src/utils/hashPassword";

describe("hashPassword", () => {
    test("should return a hashed password", async () => {
        const password = "Password@123";
        const hashedPassword = await hashPassword(password);

        expect(typeof hashedPassword).toBe("string");
        expect(hashedPassword).not.toBe(password);
    })

    test("should create a valid bcrypt hash", async () => {
        const password = "Password@123";
        const hashedPassword = await hashPassword(password);

        const isValid = await bcrypt.compare(password, hashedPassword)

        expect(isValid).toBe(true);
    })

    test("should generate different hashes for the same password", async () => {
        const password = "Password@123";

        const hash1 = await hashPassword(password);
        const hash2 = await hashPassword(password);

        expect(hash1).not.toBe(hash2);
    })
});