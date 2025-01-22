import jwt from "jsonwebtoken";

export const generateToken = (userId, res)=>{
    const expirationTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
    res.cookie('jwt', token, {
        httpOnly: true,
        expires : new Date(expirationTime),
        secure: process.env.NODE_ENV === 'production',
    });
    return token;
}

export const generateOtpCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.cookie('otp_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
}
