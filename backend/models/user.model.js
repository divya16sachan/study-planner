import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    picture:  {
        type: String,
    },
    googleId: {
        type: String,
    },
    authProvider : {
        type: String,
        default: 'local', // 'local' or 'google'
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;