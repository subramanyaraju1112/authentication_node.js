import { Router } from "express";
import { signupController, signinController, verifyOtpController, resendOtpController } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController)

export default router;