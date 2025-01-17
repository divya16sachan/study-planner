import { generateVerificationCode } from "../utils/generateVerificationCode";
import { sendMail } from "../utils/sendMail";
import bcypt from "bcryptjs";
import { validateVerificationCode } from "../utils/validateVerificationCode";

export const verificationRequest = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(401).json({ message: "Unothorized: user not found" });
    }
    try {
        const emailVerificationCode = generateVerificationCode();
        const salt = await bcypt.genSalt(10);
        const emailVerificationHash = await bcypt.genSalt(emailVerificationCode, salt);

        user.verificationCode = emailVerificationHash;
        user.verificationCodeExpiration = Date.now() + 15 * 60 * 1000;
        user.verificationPurpose = "email_verification";

        await user.save();

        const mailSubject = "Email verification code";
        const mailBody = `Your verification code is ${emailVerificationCode}`;
        await sendMail(user.email, mailSubject, mailBody);

        res.status(200).json({ message: "Check your mail for varification" });
    } catch (error) {
        console.log("Error in email verificationRequest controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyCode = async (req, res) => {
    const { emailVerificationCode } = req.body;
    const { user } = req;
    if (!user) {
        return res.status(401).json({ message: "Unothorized: user not found" });
    }

    try {
        const { success, message } = await validateVerificationCode(user.email, emailVerificationCode);
        if (!success) {
            res.status(400).json({ message });
        }

        user.isEmailVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpiration = undefined;
        user.verificationPurpose = "";

        await user.save();
        res.status(200).json({ message: "email verified successfully" });
    } catch (error) {
        console.log("Error in email verifyCode controller: ", error);
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
        user.save();

        res.status(200).json({ message: "email updated successfully" });
    } catch (error) {
        console.error("Error in updateEmail controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
} 