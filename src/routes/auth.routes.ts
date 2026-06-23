import { Router } from "express";
import { signupController, signinController, verifyOtpController } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.post("/verify-otp", verifyOtpController);

export default router;