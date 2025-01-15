import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
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
    streak: {
        type: Number,
        default: 0,
    }
}) 

const User = mongoose.model('user', userSchema);
export default User;