import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { verifyOtp, resendOtp, updateEmail, checkStatus } from "../controller/email.controller.js"
import { otpLimiter, resendOtpLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

router.post('/verify-otp', otpLimiter, verifyOtp);
router.get('/resend-otp', resendOtpLimiter, resendOtp);
router.get('/check-status', checkStatus);
router.put('/update', protectRoute, updateEmail);

export default router;