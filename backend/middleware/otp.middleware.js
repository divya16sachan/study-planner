import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const checkStatus = async (req, res, next) => {
    try {
        const { otp_token } = req.cookies;
        if (!otp_token) {
            return res.status(401).json({ message: "No token provided." })
        }

        const decode = jwt.verify(otp_token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ message: "Invalid token" })

        }

        const { userId } = decode;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        req.user = user;

        if (user.isEmailVerified) {
            req.status = "verified";
            req.message = "Your email is already verified, no action needed.";

        } else if (user.verificationCodeExpiration < Date.now()) {
            req.status = "expired";
            req.message = "Verification code expired";

        } else {
            req.status = "pending";
            req.message = "Waiting for otp.";
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log("error in checkStatus middleware: \n", error);
    }
}