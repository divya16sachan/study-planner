import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { sendOtp } from '../services/otp.service.js';
import { validateOtp } from '../services/otp.service.js';

export const requestResetPasswordOtp = async (req, res) => {
    const { user } = req;

    try {
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await sendOtp({
            email: user.email,
            purpose: 'password_reset',
            subject: 'Reset Password OTP',
            messageTemplate: (code, mins) => `Your OTP for resetting your password is: ${code}\nIt is valid for ${mins} minutes.`
        });

        return res.status(200).json({ message: 'OTP successfully sent to ' + user.email });
    } catch (error) {
        console.error('Send reset password OTP error:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Failed to send OTP' });
    }
};


export const requestForgotPasswordOtp = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await sendOtp({
            email: user.email,
            purpose: 'password_reset',
            subject: 'Reset Password OTP',
            messageTemplate: (code, mins) => `Your OTP for resetting your password is: ${code}\nIt is valid for ${mins} minutes.`
        });

        return res.status(200).json({ message: 'OTP successfully sent to ' + user.email });
    } catch (error) {
        console.error('Send forgot password OTP error:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Failed to send OTP' });
    }
};


export const resetPasswordForAuthenticatedUser = async (req, res) => {
    const { newPassword, otp } = req.body;
    const { email, _id: userId } = req.user;

    if (!newPassword || !otp) {
        return res.status(400).json({ message: "Password and OTP are required" });
    }

    try {
        await validateOtp({ email, purpose: 'password_reset', otp });

        // Hash new password and update user
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const resetPasswordWithoutAuth = async (req, res) => {
    const { email, newPassword, otp } = req.body;

    if (!email || !newPassword || !otp) {
        return res.status(400).json({ message: "Email, password, and OTP are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await validateOtp({ email, purpose: 'password_reset', otp });

        // Hash new password and update user
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Public reset password error:", error);
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

