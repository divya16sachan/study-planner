import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type : String,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    passwordResetCode: {
        type: String,
    },
    passwordResetCodeExpiration: {
        type: Date,
    },
    streak: {
        type: Number,
        default: 0,
    }
}) 

const User = mongoose.model('user', userSchema);
export default User;