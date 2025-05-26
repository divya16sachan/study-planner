import express from 'express';
import {
    login,
    logout,
    signup,
    sendSignupOtp,
    updateName,
    updateEmail,
    checkAuth,
    sendEmailUpdateOtp,
    sendResetPasswordOtp,
    resetPassword,
    getUserById,
    googleLogin,
} from '../controllers/auth.controller.js';
import protectedRoute from '../middlewares/protected.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/signup', signup);
router.get('/check-auth', protectedRoute, checkAuth);
router.post('/send-signup-otp', sendSignupOtp);
router.post('/update-name', protectedRoute, updateName);
router.post('/send-email-update-otp', protectedRoute, sendEmailUpdateOtp);
router.post('/update-email', protectedRoute, updateEmail);
router.post('/send-reset-password-otp', protectedRoute, sendResetPasswordOtp);
router.post('/reset-password', protectedRoute, resetPassword);
router.get('/:id', getUserById);
router.post('/google-login', googleLogin);

export default router;
