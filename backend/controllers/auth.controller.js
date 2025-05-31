import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateJwt } from '../services/jwt.service.js';
<<<<<<< HEAD
import { sendOtp } from '../services/otp.service.js';
import { validateOtp } from '../services/otp.service.js';


export const checkAuth = (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ user });
}

export const googleLogin = async (req, res) => {
    const { email, name, picture, sub } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            if (user.authProvider === 'local') user.authProvider = 'google';
            if (!user.picture) user.picture = picture;
            await user.save();
        } else {
            user = await User.create({
                email,
                name,
                googleId: sub,
                picture,
                authProvider: 'google',
                password: null,
            });
        }

        generateJwt(user._id, email, res);

        const { password, ...safeUser } = user._doc;
        res.status(200).json({ user: safeUser });
    } catch (error) {
        console.error("OAuth login error:", error);
        res.status(500).json({ error: "Internal Server Error" });
=======

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User.create({name, email, password : hashedPassword}, '-password');
        generateJwt(newUser._id, email, res);
        res.status(201).json({ user: newUser});
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
>>>>>>> fcedc979dad6f5aaaf8bdfbc90f87d450c780619
    }
}

export const login = async (req, res) => {
<<<<<<< HEAD
    const { email, password: inputPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // If user is OAuth but has no password, disallow password login
        if (user.isOAuthUser && !user.password) {
            return res.status(403).json({ message: "OAuth users without password cannot login with password" });
        }

        if (!user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatched = await bcrypt.compare(inputPassword, user.password);

        if (!isMatched) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.isOAuthUser) {
            user.isOAuthUser = false;
            await user.save();
        }

        generateJwt(user._id, email, res);

        const { password, ...safeUser } = user._doc;
        res.status(200).json({ user: safeUser });

    } catch (error) {
        console.log("error in login\n", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

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
    const { name, email, password: inputPassword, otp } = req.body;

    if (!name || !email || !inputPassword || !otp)
        return res.status(400).json({ message: "Please fill all fields" });

    try {
        await validateOtp({ email, purpose: 'signup', otp });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(inputPassword, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });


        generateJwt(newUser._id, email, res);
        const { password, ...safeUser } = newUser._doc;
        return res.status(201).json({ user: safeUser });
    } catch (error) {
        console.error('Signup error:', error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const logout = (req, res) => {
    try {
        res.clearCookie('jwt');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
=======
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched){
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
    } catch(error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
>>>>>>> fcedc979dad6f5aaaf8bdfbc90f87d450c780619
