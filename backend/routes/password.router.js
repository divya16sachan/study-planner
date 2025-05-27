import express from 'express';
import protectedRoute from '../middlewares/protected.middleware.js';
import {
    requestResetPasswordOtp, 
    resetPasswordForAuthenticatedUser,
    requestForgotPasswordOtp,
    resetPasswordWithoutAuth,
} from '../controllers/password.controller.js';

const router = express.Router();

// Protected routes for authenticated users
router.post('/request-reset-password-otp', protectedRoute, requestResetPasswordOtp);
router.post('/reset-password', protectedRoute, resetPasswordForAuthenticatedUser);

// Public routes (accessible without authentication)
router.post('/request-forgot-password-otp', requestForgotPasswordOtp);
router.post('/reset-password-public', resetPasswordWithoutAuth);

export default router;
