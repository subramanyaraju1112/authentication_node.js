import comparePassword from "../../src/utils/comparePassword";
import hashPassword from "../../src/utils/hashPassword";

describe("comparePassword", () => {
    test("should return true for a valid password", async () => {
        const password = "Password@123";
        const hashedPassword = await hashPassword(password);

        const isValid = await comparePassword(password, hashedPassword);

        expect(isValid).toBe(true);
    })

    test("should return false for an invalid password", async () => {
        const password = "Password@123";
        const hashedPassword = await hashPassword(password);

        const isValid = await comparePassword("wrongPassword", hashedPassword);

        expect(isValid).toBe(false)
    })

    test("should return a boolean", async () => {
        const password = "Password@123";
        const hashedPassword = await hashPassword(password);

        const result = await comparePassword(password, hashedPassword);

        expect(typeof result).toBe("boolean")
    })
})