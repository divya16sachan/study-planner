import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateJwt } from '../services/jwt.service.js';
import { Otp } from '../models/otp.model.js';
import { sendOtp } from '../services/otp.service.js';
import { validateOtp } from '../services/otp.service.js';
import { deleteImage, uploadStream } from '../services/cloudinary.service.js';

export const googleLogin = async (req, res) => {
    const { email, name, picture, sub } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                name,
                googleId: sub,
                picture,
                isOAuthUser: true,
                password: null, // password will be null for OAuth users
            });
        }

        generateJwt(user._id, email, res);
        const { password, ...safeUser } = user._doc;
        res.status(200).json({ user : safeUser });
    } catch (error) {
        console.error("OAuth login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params; // Extract user ID from request parameters

    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const user = await User.findById(id, '-password'); // Fetch user from database

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Get user by ID error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


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
            email: newEmail,
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

export const sendResetPasswordOtp = async (req, res) => {
    const { user } = req;

    try {
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await sendOtp({
            email: user.email,
            purpose: 'password_reset',
            subject: 'Reset Password OTP',
            messageTemplate: (code, mins) => `Your OTP for reseting password is: ${code}\nIt is valid for ${mins} minutes.`
        });

        return res.status(200).json({ message: 'OTP successfully sent to ' + user.email });
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


        generateJwt(newUser._id, email, res);
        const { password, ...safeUser } = newUser._doc;
        return res.status(201).json({ user : safeUser });
    } catch (error) {
        console.error('Signup error:', error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password : inputPassword} = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const isMatched = await bcrypt.compare(inputPassword, user.password);
        if (!isMatched) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateJwt(user._id, email, res);
        const { password, ...safeUser } = user._doc;
        res.status(200).json({ user : safeUser });
    } catch (error) {
        console.log("error in login\n", error);
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
        // Check if the user is an OAuth user before updating the name
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isOAuthUser) {
            return res.status(403).json({ message: "OAuth users cannot update their name" });
        }

        // Update the user's name securely
        const updatedUser = await User.findByIdAndUpdate(userId, { name }, { new: true });

        return res.status(200).json({ message: "Name updated successfully", user: updatedUser });
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
        return res.status(400).json({ message: "Invalid email format" });
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

        await Otp.deleteOne({ email: newEmail, purpose: 'email_update' });

        // Check if the user is an OAuth user
        const user = await User.findById(userId);
        if (user.isOAuthUser) {
            return res.status(403).json({ message: "OAuth users cannot update their email" });
        }

        // Update email securely
        const updatedUser = await User.findByIdAndUpdate(userId, { email: newEmail }, { new: true });

        return res.status(200).json({ message: "Email updated successfully", user: updatedUser });
    } catch (error) {
        console.error('Update email error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const resetPassword = async (req, res) => {
    const { newPassword, otp } = req.body;
    const { email, _id: userId } = req.user;
    console.log({ userId })


    if (!newPassword || !otp) {
        return res.status(400).json({ message: "Password and OTP are required" });
    }
    try {
        const otpRecord = await Otp.findOne({ email, purpose: 'password_reset' });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Please request OTP first before resetting password' });
        }

        const now = new Date();
        if (now > otpRecord.expiresAt) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        await Otp.deleteOne({ email, purpose: 'password_reset' });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old profile picture if exists
    if (user.picture) {
      // Extract publicId from existing URL
      const segments = user.picture.split('/');
      const fileName = segments[segments.length - 1];
      const publicId = fileName.split('.')[0];
      await deleteImage(publicId);
    }

    // Upload new profile picture from buffer stream
    const folder = `user_profiles/${userId}`;
    const newProfilePictureUrl = await uploadStream(file.buffer, folder);

    // Update user record
    user.picture = newProfilePictureUrl;
    await user.save();

    return res.status(200).json({ message: "Profile picture updated successfully", user });

  } catch (error) {
    console.error("Update profile picture error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

