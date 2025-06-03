import express from 'express';
import {
  login,
  logout,
  signup,
  sendSignupOtp,
  checkAuth,
  googleLogin,
} from '../controllers/auth.controller.js';
import protectedRoute from '../middlewares/protected.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectedRoute, checkAuth);
router.post('/send-signup-otp', sendSignupOtp);
router.post('/google-login', googleLogin);

export default router;
