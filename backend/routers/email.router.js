import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { verifyOtp, resendOtp, updateEmail } from "../controller/email.controller.js"
import { otpLimiter, resendOtpLimiter } from "../middleware/rateLimiter.middleware.js";
import { checkStatus } from "../middleware/otp.middleware.js";

const router = express.Router();

router.post('/verify-otp', otpLimiter, checkStatus, verifyOtp);
router.get('/resend-otp', resendOtpLimiter, resendOtp);
router.get('/check-status', checkStatus, (req, res)=>{
    try {
        const {status, message} = req;
        res.status(200).json({status, message});
    } catch (error) {
        console.log("error while checking status\n", error);
    }
});
router.put('/update', protectRoute, updateEmail);

export default router;