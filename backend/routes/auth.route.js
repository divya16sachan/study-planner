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
  updateProfilePicture,
} from '../controllers/auth.controller.js';
import protectedRoute from '../middlewares/protected.middleware.js';
import upload from '../middlewares/multer.middleware.js';

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

router.post(
  '/update-profile-picture',
  protectedRoute,
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        // This catches multer errors like invalid file type
        return res.status(400).json({ message: err.message });
      }
      next(); // no errors, proceed to controller
    });
  },
  updateProfilePicture
);

export default router;
