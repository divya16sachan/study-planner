import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateOtpCookie, generateToken } from "../utils/jwt.js";
import { validateVerificationCode } from "../utils/validateVerificationCode.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { sendMail } from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import { verifyEmailTemplate } from "../utils/mailTemplates.js";


export const verifyOtp = async (req, res) => {
    try {
        const { emailVerificationCode } = req.body;
        const { status, message, user } = req;

        if (status === "verified") return res.status(200).json({ message });
        if (status === "expired") return res.status(400).json({ message });

        // Verifying the otp
        const isMatch = await bcrypt.compare(emailVerificationCode, user.verificationCode)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        // Clear the verification and save it  
        user.isEmailVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpiration = undefined;
        user.verificationPurpose = undefined;
        res.clearCookie('otp_token');
        await user.save();

        // Generating jwt token and appending with response cookie
        generateToken(user._id, res);
        res.status(200).json({ user, message: "Email has been verified." });

    } catch (error) {
        console.log("Error in email verifyOtp controller: ", error);
        res.status(500).json({ message: "Internal server error." });
    }
}


export const resendOtp = async (req, res) => {
    try {
        const { status, message, user } = req;

        if (status === "verified") return res.status(200).json({ message });
        if (status === "expired") return res.status(400).json({ message });

        // verfication code hashing
        const saltForVerification = await bcrypt.genSalt(10);
        const emailVerificationCode = generateVerificationCode();
        const emailVerificationHash = await bcrypt.hash(emailVerificationCode, saltForVerification);

        // Re-configuration
        user.verificationCode = emailVerificationHash;
        user.verificationPurpose = "email_verification";
        user.verificationCodeExpiration = Date.now() + 15 * 60 * 1000;

        await user.save();

        // sending mail to the 
        const mailSubject = "Email verification code";
        const title = "Email Verification";
        const mailMessage = "Thank you for registering with NoteHub. To complete your registration and verify your email address, please use the following verification code:";
        const mailBody = verifyEmailTemplate(title, mailMessage, emailVerificationCode);
        await sendMail(user.email, mailSubject, mailBody);

        // storing cookie and Set expiration time of 15 min
        generateOtpCookie(user._id, res);
        
        console.log(emailVerificationCode);
        return res.status(200).json({
            message: "Please check your mail for verification"
        });
    } catch (error) {
        console.log("Error in resend email verification\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateEmail = async (req, res) => {
    const { newEmail } = req.body;
    const { user } = req;
    if (!user) {
        return res.status(401).json({ message: "Unothorized: user not found." });
    }
    if (!newEmail) {
        return res.status(400).json({ message: "Email must required." });
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    try {
        user.newEmail = email;
        user.isEmailVerified = false;
        await user.save();

        res.status(200).json({ message: "email updated successfully" });
    } catch (error) {
        console.error("Error in updateEmail controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
} 
