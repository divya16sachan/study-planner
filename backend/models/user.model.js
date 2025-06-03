import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String, required: true 
    },
    email: {
        type: String, required: true, unique: true 
    },
    password: {
        type: String // optional for Google users
    }, 
    picture: {
        type: String 
    },
    googleId: {
        type: String // Google sub (optional)
    }, 
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;