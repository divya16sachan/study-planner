import express from "express";
import {
    forgetPassword,
    verifyPassword,
    changePassword,
    
    updatePassword,
} from "../controller/password.controller.js";
import { protectRoute } from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.post('/forget', forgetPassword);
router.post('/verify', verifyPassword);
router.post('/change', changePassword);

router.put('/update', protectRoute, updatePassword);

export default router;