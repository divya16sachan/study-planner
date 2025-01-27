import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { verifyOtp, resendOtp, updateEmail, verifyUpdation } from "../controller/email.controller.js"
import { otpLimiter, resendOtpLimiter } from "../middleware/rateLimiter.middleware.js";
import { checkStatus } from "../middleware/otp.middleware.js";

const router = express.Router();

router.post('/verify-otp', otpLimiter, checkStatus, verifyOtp);
router.get('/resend-otp', resendOtpLimiter, checkStatus, resendOtp);
router.get('/check-status', checkStatus, (req, res)=>{
    try {
        const {status, message} = req;
        res.status(200).json({status, message});
    } catch (error) {
        console.log("error while checking status\n", error);
    }
});
router.post('/update', protectRoute, updateEmail);
router.get('/verify-updation', verifyUpdation);
export default router;