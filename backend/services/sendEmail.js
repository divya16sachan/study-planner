import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", // or use SMTP config
        auth: {
            user: process.env.MAIL_USER, // your email
            pass: process.env.MAIL_PASS, // app password or real pass
        },
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
};
