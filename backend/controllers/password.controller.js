import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { sendOtp, validateOtp } from '../services/otp.service.js';

export const requestResetPasswordOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: `User with email ${email} not found` });
        }

        await sendOtp({
            email: user.email,
            purpose: 'password_reset',
        });

        return res.status(200).json({ message: `OTP successfully sent to ${user.email}` });
    } catch (error) {
        console.error('Error sending reset password OTP:', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const resetPassword = async (req, res)=>{
    const {email, newPassword, otp} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) res.status(400).json({message: `user ${email} not found`});

        await validateOtp({email, purpose: 'password_reset', otp});

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password reset successfully",
        })
    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(error.statusCode || 500).json({ 
            message: error.message || "Internal Server Error",
        });
    }
}

