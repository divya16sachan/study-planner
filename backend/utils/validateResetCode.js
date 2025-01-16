export const validateResetCode = async (email, passwordResetCode) => {
    const user = await User.findOne({ email });
    if (!user) {
        return { success: false, message: "User not found." };
    }

    if (user.passwordResetCode !== passwordResetCode) {
        return { success: false, message: "Invalid reset code." };
    }

    if (user.passwordResetCodeExpiration < Date.now()) {
        return { success: false, message: "Reset code has expired." };
    }

    return { success: true, user };
}