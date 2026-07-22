import { Router } from "express";
import { signupController, signinController, verifyOtpController, resendOtpController, logoutController, refreshTokenController } from "../controllers/auth.controller";
import authenticate from "../middlewares/auth.middleware";
import validate from "../middlewares/validate.middleware";
import { logoutSchema, refreshTokenSchema, resendOtpSchema, signinSchema, signupSchema, verifyOtpSchema } from "../validations/auth.validations";

const router = Router();

// public routes
router.post("/signup", validate(signupSchema), signupController);
router.post("/signin", validate(signinSchema), signinController);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtpController);
router.post("/resend-otp", validate(resendOtpSchema), resendOtpController);
router.post("/refresh-token", validate(refreshTokenSchema), refreshTokenController);

// protected routes
router.post("/logout", validate(logoutSchema), authenticate, logoutController);

export default router;