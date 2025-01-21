import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { verifyCode, resendCode, updateEmail} from "../controller/email.controller.js"

const router = express.Router();

router.post('/verify-code',  verifyCode);
router.get('/resend-code', resendCode);
router.put('/update', protectRoute, updateEmail);

export default router;