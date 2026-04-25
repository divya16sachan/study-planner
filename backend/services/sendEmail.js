import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

export const sendEmail = async (email, subject, text, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: ENV.MAIL_USER,
            pass: ENV.MAIL_PASS,
        },
    });

    const mailOptions = {
        from: ENV.MAIL_USER,
        to: email,
        subject,
        text, // plain text fallback
        html, // HTML content
    };

    await transporter.sendMail(mailOptions);
};