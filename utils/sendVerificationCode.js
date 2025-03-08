import { sendEmail } from "./sendEmail.js"
import { generateVerificationOtpEmailTemplate } from "./emailTemplate.js"

export async function sendVerificationCode(verificationCode,email,res){
    try {
        const message =generateVerificationOtpEmailTemplate(verificationCode);
        sendEmail({
            email,
            subject:"verification code (Bookwork Library Management System)",
            message,
        });
        res.status(200).json({
            success:true,
            message:"Verification code send successfuly",
        });
    } catch (error) {
     return res.status(500).json({
        success:false,
        message:"Verification code failed to send",
     })
    }
}