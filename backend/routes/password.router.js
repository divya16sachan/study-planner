import express from 'express';
import {
    requestResetPasswordOtp,
    resetPassword,
} from '../controllers/password.controller.js';


const router = express.Router();

router.post('/request-reset-password-otp', requestResetPasswordOtp);
router.post('/reset-password', resetPassword);

export default router;
