import User from "../model/user.model.js"
import { sendMail } from "../utils/sendMail.js";
import bcrypt from "bcryptjs";

// UTILITY
import { generateToken } from "../utils/jwt.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { validateVerificationCode } from "../utils/validateVerificationCode.js";

export const resetPasswordRequest = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not exists." });
        }

        const passwordResetCode = generateVerificationCode();
        const salt = await bcrypt.genSalt(10); 
        const passwordResetCodeHash = await bcrypt.hash(passwordResetCode, salt);

        
        // set the verification code for password reset and expiration time of 15 min
        user.verificationPurpose = "password_reset";
        user.verificationCode = passwordResetCodeHash;
        user.verificationCodeExpiration = Date.now() + 15 * 60 * 1000;
        
        await user.save();
        
        const mailSubject = 'Password Reset Code';
        const mailBody = `Your password reset code is: ${passwordResetCode}`;
        await sendMail(user.email, mailSubject, mailBody);

        res.status(200).json({ message: "Password reset code sent successfully." });
    } catch (error) {
        console.error("Error in resetPasswordRequest controller.", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const verifypasswordResetCode = async (req, res) => {
    const { email, passwordResetCode } = req.body;

    try {
        const {success, message, user} = await validateVerificationCode(email, passwordResetCode);
        if (!success) {
            res.status(400).json({ message});
        }

        res.status(200).json({ message: "Reset code verified successfully" });
    } catch (error) {
        console.error("Error in verifypasswordResetCode controller.", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const resetPassword = async (req, res) => {
    const { email, passwordResetCode, newPassword } = req.body;

    if(newPassword.length < 6){
        return res.status(400).json({message: "Password must be at least 6 characters."});
    }

    try {
        const {success, message, user} = await validateVerificationCode(email, passwordResetCode);
        if (!success) {
            res.status(400).json({ message});
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.verificationCode = undefined;
        user.verificationCodeExpiration = undefined;
        user.verificationPurpose = "";

        generateToken(user._id, res);
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        console.error("Error in resetPassword controller.", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
