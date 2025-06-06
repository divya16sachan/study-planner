import jwt from 'jsonwebtoken';

export const generateJwt = (id, email, res) => {
    const token = jwt.sign({id, email}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return token;
} 