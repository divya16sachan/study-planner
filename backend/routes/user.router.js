import express from 'express';
import {
    updateName,
    sendEmailUpdateOtp,
    updateEmail,
    getUserById,
    updateProfilePicture,
} from '../controllers/user.controller.js';
import protectedRoute from '../middlewares/protected.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/update-name', protectedRoute, updateName);
router.post('/send-email-update-otp', protectedRoute, sendEmailUpdateOtp);
router.post('/update-email', protectedRoute, updateEmail);
router.get('/:id', getUserById);
router.post(
    '/update-profile-picture',
    protectedRoute,
    (req, res, next) => {
        upload.single('file')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    },
    updateProfilePicture
);

export default router;