import express from 'express';
import {
    login,
    logout,
    signup,
    sendSignupOtp,
    updateName,
    updateEmail,
    checkAuth,
    sendEmailUpdateOtp
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

export default router;
