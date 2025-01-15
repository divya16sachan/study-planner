import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
    const { fullName, userName, password } = req.body;
    if (!fullName || !userName || !password) {
        return res.status(400).json({ message: "All fields required." });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must contain at least 6 characters." });
    }

    if (!/^[a-zA-Z0-9._]{3,30}$/.test(userName)) {
        return res.status(400).json({ message: "userName invalid format." });
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
            userName,
            password: hashedPassword
        });

        if(!newUser){
            return res.status(400).json({ message: "Invalid info provided." });
        }

        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            userName: newUser.userName,
            streak: newUser.streak,
        });


    } catch (error) {
        console.error("error in signup controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const login = async (req, res) => {
    const {userName, password} = req.body;
    if(!userName || !password){
        return res.status(400).json({ message: "All fields required." });
    }

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "Invalid credential provided." });
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if(!isMatched){
            return res.status(400).json({ message: "Invalid credential provided." });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            streak: user.streak,
        });

    } catch (error) {
        console.error("error in login controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }

}

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.error("error in logout controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json({
            _id : req.user._id,
            userName : req.user.userName,
            fullName : req.user.fullName,
        })
    } catch (error) {
        console.error('Error in checkAuth controller: ', error);
        res.status(500).json({message: "Internal server error"});
    }
}