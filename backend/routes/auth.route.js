import express from 'express';
<<<<<<< HEAD
import {
  login,
  logout,
  signup,
  sendSignupOtp,
  checkAuth,
  googleLogin,
} from '../controllers/auth.controller.js';
import protectedRoute from '../middlewares/protected.middleware.js';
=======
import { login, signup} from '../controllers/auth.controller.js';
>>>>>>> fcedc979dad6f5aaaf8bdfbc90f87d450c780619

const router = express.Router();

router.post('/login', login);
<<<<<<< HEAD
router.post('/logout', logout);
router.post('/signup', signup);
router.get('/check-auth', protectedRoute, checkAuth);
router.post('/send-signup-otp', sendSignupOtp);
router.post('/google-login', googleLogin);

export default router;
=======
router.post('/signup', signup);

export default router;
>>>>>>> fcedc979dad6f5aaaf8bdfbc90f87d450c780619
