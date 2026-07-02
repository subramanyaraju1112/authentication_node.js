import { Router } from "express";
import { signupController, signinController, verifyOtpController, resendOtpController, logoutController } from "../controllers/auth.controller";
import authenticate from "../middlewares/auth.middleware";

const router = Router();

// public routes
router.post("/signup", signupController);
router.post("/signin", signinController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController);

// protected routes
router.post("/logout", authenticate, logoutController);

export default router;