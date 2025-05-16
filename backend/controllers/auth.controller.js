import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateJwt } from '../services/jwt.service.js';

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
    }
}

export const login = async (req, res) => {
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