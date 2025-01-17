import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import { cloudinary, removeCloudinaryImage } from "../utils/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, email, userName, password } = req.body;
    if (!fullName || !email || !userName || !password) {
        return res.status(400).json({ message: "All fields required." });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must contain at least 6 characters." });
    }

    if (!/^[a-zA-Z0-9._]{3,30}$/.test(userName)) {
        return res.status(400).json({ message: "invalid userName format." });
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    try {
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: "userName already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            userName,
            password: hashedPassword
        });

        if (!newUser) {
            return res.status(400).json({ message: "Invalid info provided." });
        }

        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            userName: newUser.userName,
            email: newUser.email,
            streak: newUser.streak,
        });


    } catch (error) {
        console.error("error in signup controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) {
        return res.status(400).json({ message: "All fields required." });
    }

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "Invalid credential provided." });
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
            return res.status(400).json({ message: "Invalid credential provided." });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            email: user.email,
            streak: user.streak,
        });

    } catch (error) {
        console.error("error in login controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("error in logout controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const checkAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: "user not found" });
        }

        res.status(200).json({
            _id: req.user._id,
            userName: req.user.userName,
            fullName: req.user.fullName,
            email: req.user.email,
            streak: req.user.streak,
        })
    } catch (error) {
        console.error('Error in checkAuth controller: ', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUser = async (req, res) => {
    const { userName } = req.params;
    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: `User not found` });
        }
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            email: user.email,
            streak: user.streak,
        })
    } catch (error) {
        console.error('Error in getUser controller: ', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const uploadAvatar = async (req, res) => {
    const { avatarUrl } = req.body;
    const { user } = req;
    if (!user) {
        return res.status(401).json({ message: "Unothorized: user not found" });
    }
    if (!avatarUrl) {
        return res.status(400).json({ message: "Avatar must required." });
    }
    try {
        const publicId = `user_${user._id}_avatar`;
        const result = await cloudinary.uploader.upload(avatarUrl, {
            public_id: publicId,
            overwrite: true
        })

        user.avatarUrl = result.secure_url;
        await user.save();

        res.status(200).json({ message: "Avatar uploaded successfully" });
    } catch (error) {
        console.error('Error in uploadAvatar controller: ', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const removeAvatar = async (req, res) => {
    try {
        const { success, status, message } = await removeCloudinaryImage(res.user.avatarUrl);
        res.status(status).json({ message });
    } catch (error) {
        console.error('Error in removeAvatar controller: ', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateUserInfo = async (req, res) => {
    const { userName, fullName } = req.body;
    const { user } = req;
    if (!user) {
        return res.status(401).json({ message: "Unothorized: user not found" });
    }
    if (!userName || !fullName) {
        return res.status(400).json({ message: "userName or fullName not provided" });
    }

    try {
        user.userName = userName;
        user.fullName = fullName;
        user.save();

        res.status(200).json({message: "user info updated successfully"});
    } catch (error) {
        console.error('Error in updateuserInfo controller: ', error);
        res.status(500).json({ message: "Internal server error" });
    }
}