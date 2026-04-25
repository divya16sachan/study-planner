import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const generateJwt = (id, email, res) => {
    const token = jwt.sign({ id, email }, ENV.JWT_SECRET, {
        expiresIn: '30d'
    })

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    return token;
} 