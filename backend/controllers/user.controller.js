import { deleteImage, uploadStream } from '../services/cloudinary.service.js';
import User from '../models/user.model.js';
import { sendOtp } from '../services/otp.service.js';
import { validateOtp } from '../services/otp.service.js';


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
        // Validate OTP using helper function
        await validateOtp({ email: newEmail, purpose: 'email_update', otp });

        // Check if the user is an OAuth user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isOAuthUser) {
            return res.status(403).json({ message: "OAuth users cannot update their email" });
        }

        // Update email securely
        const updatedUser = await User.findByIdAndUpdate(userId, { email: newEmail }, { new: true });

        return res.status(200).json({ message: "Email updated successfully", user: updatedUser });
    } catch (error) {
        console.error('Update email error:', error);
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const getUserByEmail = async (req, res) => {
    const { email } = req.params; // Ensure email is passed as a param

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    try {
        const user = await User.findOne({ email }).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Get user by email error:", error);
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
