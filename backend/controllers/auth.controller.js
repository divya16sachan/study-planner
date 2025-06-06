import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateJwt } from '../services/jwt.service.js';
import { sendOtp, validateOtp } from '../services/otp.service.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        googleId: sub,
        password: null,
      });
    } else if (!user.googleId) {
      user.googleId = sub;
      await user.save();
    }

    generateJwt(user._id, email, res);

    const { password, ...safeUser } = user._doc;
    res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
};

export const checkAuth = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  res.status(200).json({ user: req.user });
};

export const sendSignupOtp = async (req, res) => {
  const { email } = req.body;
  try {
    await sendOtp({
      email,
      purpose: 'signup',
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(err.status || 500).json({ message: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  const { name, email, password: inputPassword, otp } = req.body;
  if (!name || !email || !inputPassword || !otp)
    return res.status(400).json({ message: "Please fill all fields" });

  try {
    await validateOtp({ email, purpose: 'signup', otp });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(inputPassword, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    generateJwt(newUser._id, email, res);
    const { password, ...safeUser } = newUser._doc;
    res.status(201).json({ user: safeUser });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password: inputPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatched = await bcrypt.compare(inputPassword, user.password);
    if (!isMatched)
      return res.status(400).json({ message: "Invalid credentials" });

    generateJwt(user._id, email, res);
    const { password, ...safeUser } = user._doc;
    res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie('jwt');
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
