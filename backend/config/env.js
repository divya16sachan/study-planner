import dotenv from "dotenv";
dotenv.config();

function required(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} not defined in env`);
    }
    return value;
}

function optional(key, defaultValue) {
    const value = process.env[key] || defaultValue;
    return value;
}

export const ENV = {
    PORT: optional('PORT', 8000),
    CLIENT_URL: required('CLIENT_URL'),

    JWT_SECRET: required('JWT_SECRET'),
    MONGODB_URI: required('MONGODB_URI'),

    CLOUDINARY_CLOUD_NAME: required('CLOUDINARY_CLOUD_NAME'),
    CLOUDINARY_API_KEY: required('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: required('CLOUDINARY_API_SECRET'),

    MAIL_USER: required('MAIL_USER'),
    MAIL_PASS: required('MAIL_PASS'),
}