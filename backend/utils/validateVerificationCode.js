import bcrypt from "bcryptjs";

export const validateVerificationCode = async (user, verificationCode) => {
    if (!user) {
        return { success: false, message: "User not provided." };
    }
    
    if (!user.verificationCode) {
        return { success: false, message: "MISSING_OTP_HASH: Request a OTP first" };
    }
    
    if (user.verificationCodeExpiration < Date.now()) {
        return { success: false, message: "Your OTP has expired. Please re-signup." };
    }
    
    const isMatch = await bcrypt.compare(verificationCode, user.verificationCode);
    if (!isMatch) {
        return { success: false, message: "Invalid verification code." };
    }
    return { success: true, user };
}