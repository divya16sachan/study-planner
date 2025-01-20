import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { verificationRequest,  verifyCode, updateEmail} from "../controller/email.controller.js"

const router = express.Router();

router.get('/verification-request', protectRoute, verificationRequest);
router.post('/verify-code', protectRoute, verifyCode);
router.put('/update', protectRoute, updateEmail);

export default router;