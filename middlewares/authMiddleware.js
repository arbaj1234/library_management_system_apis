import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler, { errorMiddleware } from "../middlewares/errorMiddleware.js";
import UserModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return next(new ErrorHandler("User is not authenticated", 400))
        }

        // decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // console.log("decoded" , decoded);
        const user = await UserModel.findById(decoded._id)
        req.user = user
        return next()
    } catch (error) {
        next(error.stack);
    }
})