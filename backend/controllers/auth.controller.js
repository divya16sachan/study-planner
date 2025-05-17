import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateJwt } from '../services/jwt.service.js';
import { Otp } from '../models/otp.model.js';
import { sendOtp } from '../services/otp.service.js';
import { validateOtp } from '../services/otp.service.js';



export const checkAuth = (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ user });
}

export const sendEmailUpdateOtp = async (req, res) => {
    const { newEmail } = req.body;

    if (!newEmail) {
        return res.status(400).json({ message: "New email is required" });
    }

    try {
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        await sendOtp({
            email : newEmail,
            purpose: 'email_update',
            subject: 'Update Email OTP',
            messageTemplate: (code, mins) => `Your OTP for updating email is: ${code}\nIt is valid for ${mins} minutes.`
        });

        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Send email update OTP error:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Failed to send OTP' });
    }
};


export const sendSignupOtp = async (req, res) => {
    const { email } = req.body;
    try {
        await sendOtp({
            email,
            purpose: 'signup',
            subject: 'Signup OTP',
            messageTemplate: (code, mins) => `Your OTP is: ${code}\nIt is valid for ${mins} minutes.`
        });

        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        return res.status(err.status || 500).json({ message: "Internal server error" });
    }
};

export const signup = async (req, res) => {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp)
        return res.status(400).json({ message: "Please fill all fields" });

    try {
        await validateOtp({ email, purpose: 'signup', otp });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        };

        generateJwt(newUser._id, email, res);
        return res.status(201).json({ user: userResponse });
    } catch (error) {
        console.error('Signup error:', error.message);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateJwt(user._id, email, res);
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateName = async (req, res) => {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    try {
        const user = await User.findByIdAndUpdate(userId, { name }, { new: true });
        return res.status(200).json({ message: "Name updated successfully", user });
    } catch (error) {
        console.error('Update name error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateEmail = async (req, res) => {
    const { newEmail, otp } = req.body;
    const userId = req.user._id;

    if (!newEmail || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        const otpRecord = await Otp.findOne({ email: newEmail, purpose: 'email_update' });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Please request OTP first before updating email' });
        }

        const now = new Date();
        if (now > otpRecord.expiresAt) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        await Otp.deleteOne({ email: newEmail, purpose: 'signup' });

        const user = await User.findByIdAndUpdate(userId, { email: newEmail }, { new: true });
        return res.status(200).json({ message: "Email updated successfully", user });
    } catch (error) {
        console.error('Update email error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

