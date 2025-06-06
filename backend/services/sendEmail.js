import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject,
        text, // plain text fallback
        html, // HTML content
    };

    await transporter.sendMail(mailOptions);
};