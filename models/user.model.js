import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import crypto from 'crypto';

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        required: true,
        type: String,
        select: false
    },
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User"
    },
    accountVerified: {
        type: Boolean,
        default: false
    },
    borrowedBooks: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Borrow"
        },
        returned: {
            type: Boolean,
            default: false,
        },
        bookTitle: String,
        borrowedDate: Date,
        dueDate: Date,
    }],
    avatar: {
        public_id: String,
        url: String,
    },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true })


// userSchema.methods.generateVerificationCode = function () {
//     function generateRandomFiveDigitNumber() {
//         const firstDigit = Math.floor(Math.random() * 9) + 1;
//         const remainingDigits = Math.floor(Math.random() * 10000).toString().padStart(4, 0)
//         return parseInt(firstDigit + remainingDigits)
//     }
//     const verificationCode = generateRandomFiveDigitNumber()
//     this.verificationCode = verificationCode
//     this.verificationCodeExpire = Date.now() + 15 * 60 * 1000 //15-min expiriration
//     return verificationCode
// }

userSchema.methods.generateVerificationCode = function () {
    // Generate a 5-digit random number (10000 - 99999)
    this.verificationCode = Math.floor(10000 + Math.random() * 90000);

    // Set expiration time (15 minutes from now)
    this.verificationCodeExpire = Date.now() + 15 * 60 * 1000;

    return this.verificationCode;
};

// Generating the token
userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION })
}

userSchema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000 // 15-min
    return resetToken;
}

const UserModel = mongoose.model('User', userSchema)

export default UserModel