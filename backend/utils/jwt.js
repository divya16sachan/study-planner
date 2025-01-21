import jwt from "jsonwebtoken";

export const generateToken = (userId, res)=>{
    const expirationTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
    res.cookie('jwt', token, {
        expires : new Date(expirationTime),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
    return token;
}