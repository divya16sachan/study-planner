import express from "express";
import { resetPasswordRequest, verifypasswordResetCode, resetPassword } from "../controller/password.controller.js";

const router = express.Router();


// Step 1: User requests reset code
router.get('/reset-request', resetPasswordRequest);

// Step 2: User submits the reset code
router.post('/verify-reset-code', verifypasswordResetCode);

// Step 3: User resets password
router.post('/reset-password', resetPassword); 

export default router;