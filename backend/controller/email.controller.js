import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import { validateVerificationCode } from "../utils/validateVerificationCode.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { sendMail } from "../utils/sendMail.js";


export const verifyCode = async (req, res) => {
    const { emailVerificationCode } = req.body;
    const _id = req.cookies._id

    try {
        const user = await User.findById(_id).select('-password');
        if (!user) {
            return res.status(400).json({ message: "user not found" });
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

        await user.save();
        // generating jwt token and appending with response cookie
        generateToken(user._id, res);
        res.status(200).json({ user, message: "Email has been verified." });
    } catch (error) {
        console.log("Error in email verifyCode controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const resendCode = async (req, res) => {
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