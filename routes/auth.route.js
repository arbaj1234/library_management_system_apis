import express from 'express';
import { registerUser, verifyOtp } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';




const authRouter=express.Router();

authRouter.post('/ragister',registerUser);
authRouter.post('/verify-Otp',verifyOtp)




export default authRouter 