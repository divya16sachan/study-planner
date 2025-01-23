import express from "express";
import {
    login,
    signup,
    logout,
    getUser,
    checkAuth,
    uploadAvatar,
    removeAvatar,
    updateFullName,
    updateUserName,
    updateEmail,
} from "../controller/user.controller.js"
import { protectRoute } from "../middleware/protectRoute.js";
import { signupLimiter, loginLimiter } from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

router.post('/signup', signupLimiter, signup);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);

router.post('/upload-avatar', protectRoute, uploadAvatar);
router.delete('/remove-avatar', protectRoute, removeAvatar);

router.put('/update-fullname', protectRoute, updateFullName);
router.put('/update-username', protectRoute, updateUserName);
router.put('/update-email', protectRoute, updateEmail);

router.get('/check/auth', protectRoute, checkAuth);
router.get('/:userName', getUser);

export default router;