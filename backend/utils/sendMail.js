import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const mailOption = {
        from: process.env.EMAIL_USER,
        to,
        subject, 
        text
    };

    try {
        const info = transporter.sendMail(mailOption);
    } catch (error) {
        console.log('Error sending email.');
        throw error;
    }
}