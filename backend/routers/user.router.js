import express from "express";
import { 
    login,
    signup,
    logout,
    getUser,
    checkAuth,
    uploadAvatar,
    removeAvatar,
    updateUserInfo
} from "../controller/user.controller.js"
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/upload-avatar', protectRoute, uploadAvatar);
router.delete('/remove-avatar', protectRoute, removeAvatar);

router.put('/update-user-Info', protectRoute, updateUserInfo);

router.get('/check/auth', protectRoute, checkAuth);
router.get('/:userName', getUser);

export default router;