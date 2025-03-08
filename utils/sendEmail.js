import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, subject, message }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // Example: "smtp.gmail.com"
            port: process.env.SMTP_PORT, // Example: 587 or 465
            secure: process.env.SMTP_PORT == 465, // Use SSL for port 465, false for 587
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject, // ✅ Fix: Ensure subject is included
            html: message
        };

        const info = await transporter.sendMail(mailOptions);
        // console.log(`✅ Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        // console.error("❌ Error sending email:", error);
        // throw new Error("Email sending failed");
        console.log(error.stack);
    }
};