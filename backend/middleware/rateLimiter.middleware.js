import rateLimit from 'express-rate-limit';

// 5 request per 15 min
export const signupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: "Too many signup attempts from this IP, please try again later.",
})

// 3 request per 10 min
export const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 3, 
    message: "Too many OTP verification attempts. Please try again later.",
});

// 1 request per minute
export const resendOtpLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 1, 
    message: "You can only request a new OTP every 5 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});

// 5 login attempts per 10 minutes
export const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 5,
    message: "Too many login attempts from this IP, please try again later."
});