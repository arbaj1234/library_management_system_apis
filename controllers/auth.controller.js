import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler, { errorMiddleware } from "../middlewares/errorMiddleware.js";
import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplate.js";
import { sendToken } from "../utils/sendToken.js";



export const registerUser = catchAsyncError(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new ErrorHandler("Please enter all fields", 400));
        }

        const isRegistered = await UserModel.exists({ email, accountVerified: true });
        if (isRegistered) {
            return next(new ErrorHandler("User already registered", 400));
        }

        const registrationAttemptByUser = await UserModel.find({
            email,
            accountVerified: false,
        })
        if (registrationAttemptByUser >= 5) {
            return next(new ErrorHandler("Too many registration attempts. Please try again later", 400))
        }

        if (password.length < 8 || password.length > 16) {
            return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const verificationCode = user.generateVerificationCode();
        await user.save(); 

    
        sendVerificationCode(verificationCode, email, res);


    } catch (error) {
        next(error);
    }
});


export const verifyOtp = catchAsyncError(async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return next(new ErrorHandler("Please provide email and otp", 400))
        }
        const userAllEntries = await UserModel.find({
            email,
            accountVerified: false
        }).sort({ createdAt: -1 })
        console.log("userAllEntries", userAllEntries);

        if (!userAllEntries) {
            return next(new ErrorHandler("user not found", 404))
        }

        let user;
        if (userAllEntries.length > 1) {
            user = userAllEntries[0]
            await UserModel.deleteMany({
                _id: { $ne: user._id },
                email,
                accountVerified: false
            })
        } else {
            user = userAllEntries[0];
        }

        if (user.verificationCode !== Number(otp)) {
            return next(new ErrorHandler("Invalid verification OTP code", 400))
        }

        const currentTime = Date.now();
        const verificationCodeExpiryTime = new Date(user.verificationCodeExpire).getTime()

        if (currentTime > verificationCodeExpiryTime) {
            return next(new ErrorHandler('OTP Expired', 400))
        }

        user.accountVerified = true
        user.verificationCode = null;
        user.verificationCodeExpire = null;
        await user.save({ validateModifiedOnly: true });

        sendToken(user, 200, "Account Verified", res)

    } catch (error) {
        return next(new ErrorHandler("OTP Verification Failed", 500))
    }
})



export const loginUser = catchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return next(new ErrorHandler("Email and password is required", 400))
        }

        const user = await UserModel.findOne({ email, accountVerified: true }).select("+password")
        if (!user) {
            return next(new ErrorHandler("User not found", 400))
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid email or password", 400))
        }
        sendToken(user, 200, `Welcome ${user.name}`, res)
    } catch (error) {
        next(error)
    }
})




