import generateOtp from "../../src/utils/generateOtp"

describe("generateOtp", () => {
    test("should generate a 6-digit OTP", () => {
        const otp = generateOtp();

        expect(otp).toHaveLength(6);
        expect(otp).toMatch(/^\d{6}$/);
    });
    test("should return a string", () => {
        const otp = generateOtp();

        expect(typeof otp).toBe("string");
    });
    test("should generate different OTPs", () => {
        const otp1 = generateOtp();
        const otp2 = generateOtp();

        expect(otp1).not.toBe(otp2);
    });
});