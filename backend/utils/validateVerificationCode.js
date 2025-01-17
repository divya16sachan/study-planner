import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const validateVerificationCode = async (email, verificationCode) => {
    const user = await User.findOne({ email });
    if (!user) {
        return { success: false, message: "User not found." };
    }

    const isMatch = await bcrypt.compare(verificationCode, user.verificationCode);
    if (!isMatch) {
        return { success: false, message: "Invalid reset code." };
    }

    if (user.verificationCodeExpiration < Date.now()) {
        return { success: false, message: "Reset code has expired." };
    }

    return { success: true, user };
}