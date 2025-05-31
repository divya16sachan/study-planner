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
<<<<<<< HEAD
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
=======
        required: true,
    },
>>>>>>> fcedc979dad6f5aaaf8bdfbc90f87d450c780619
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;