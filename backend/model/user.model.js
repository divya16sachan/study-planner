import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    avatarUrl: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        required: true,
    },
    verificationCode: {
        type: String,
    },
    verificationCodeExpiration: {
        type: Date,
    },
    verificationPurpose: {
        type: String, // password_reset || email_verification
    },
    streak: {
        type: Number,
        default: 0,
    }
})

const User = mongoose.model('user', userSchema);
export default User;