import { Router } from "express";
import { signupController, signinController, verifyOtpController, resendOtpController, logoutController, refreshTokenController } from "../controllers/auth.controller";
import authenticate from "../middlewares/auth.middleware";

const router = Router();

// public routes
router.post("/signup", signupController);
router.post("/signin", signinController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController);
router.post("/refresh-token", refreshTokenController);

// protected routes
router.post("/logout", authenticate, logoutController);

export default router;