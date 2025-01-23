import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import { validateVerificationCode } from "../utils/validateVerificationCode.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { sendMail } from "../utils/sendMail.js";
import jwt from "jsonwebtoken";

export const verifyOtp = async (req, res) => {
    try {
        const { emailVerificationCode } = req.body;
        const { otp_token } = req.cookies;
        const decode = jwt.verify(otp_token, process.env.JWT_SECRET)
        if (!decode) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const { userId } = decode;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (user.isEmailVerified) {
            return res.status(200).json({ user, message: "Your email is already verified, no action needed." });
        }

        const { success, message } = await validateVerificationCode(user, emailVerificationCode);
        if (!success) {
            return res.status(400).json({ message });
        }

        // clearing the the verification 
        user.isEmailVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpiration = undefined;
        user.verificationPurpose = undefined;

        res.clearCookie('otp_token');

        await user.save();
        // generating jwt token and appending with response cookie
        generateToken(user._id, res);
        res.status(200).json({ user, message: "Email has been verified." });
    } catch (error) {
        console.log("Error in email verifyOtp controller: ", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const checkStatus = async (req, res) => {
    try {
        const { otp_token } = req.cookies;
        if (!otp_token) {
            return res.status(401).json({ message: "No token provided." });
        }

        const decode = jwt.verify(otp_token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const { userId } = decode;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isEmailVerified) {
            return res.status(200).json({ status: "verified", message: "Email already verified" });
        }

        if (user.verificationCodeExpiration > Date.now()) {
            return res.status(400).json({ status: "expired", message: "Verification code expired" });
        }

        res.status().json({ status: "pending", message: "Verification code expired" });
    } catch (error) {
        {
            console.log("Error in checkStatus controller: ", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}


export const resendOtp = async (req, res) => {
    const _id = req.cookies._id
    try {
        const user = await User.findById(_id).select('-password');
        if (!user) {
            return res.status(400).json({ message: "Please sign up again" });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email already has verified" });
        }

        // verfication code hashing
        const saltForVerification = await bcrypt.genSalt(10);
        const emailVerificationCode = generateVerificationCode();
        const emailVerificationHash = await bcrypt.hash(emailVerificationCode, saltForVerification);

        // 
        user.verificationCode = emailVerificationHash;
        user.verificationPurpose = "email_verification";
        user.verificationCodeExpiration = Date.now() + 15 * 60 * 1000;

        await user.save();

        // sending mail to the 
        const mailSubject = "Email verification code";
        const title = "Email Verification";
        const message = "Thank you for registering with NoteHub. To complete your registration and verify your email address, please use the following verification code:";
        const mailBody = verifyEmailTemplate(title, message, emailVerificationCode);
        await sendMail(user.email, mailSubject, mailBody);

        // storing cookie and Set expiration time of 15 min
        res.cookie("_id", user._id, {
            httpOnly: true,
            expires: new Date(Date.now() + 15 * 60 * 1000),
            secure: process.env.NODE_ENV === 'production',
        })

        return res.status(200).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                userName: user.userName,
                avatarUrl: user.avatarUrl,
                email: user.email,
                isEmailVerified: user.isEmailVerified,
                streak: user.streak,
            },
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
