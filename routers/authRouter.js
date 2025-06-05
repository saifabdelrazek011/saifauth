import express from 'express';
import {
    signup,
    signin,
    signout,
    verifyUser,
    changePassword,
    changeForgetedPassword,
    sendVerification,
    sendForgotPasswordCode,
    deleteAccount,
    updateUserInfo,
    getUser,
    getAllUsers
} from '../controllers/authController.js';

import { identifier } from '../middlewares/identification.js';
import { get } from 'mongoose';

const authRouter = express.Router();

authRouter.post('/signup', signup);

authRouter.post('/signin', signin);

authRouter.post('/signout', identifier, signout);

authRouter.patch("/verification/send", identifier, sendVerification);

authRouter.patch("/verification/verify", identifier, verifyUser);

authRouter.patch("/password", identifier, changePassword);

authRouter.patch("/password/forget", sendForgotPasswordCode);

authRouter.patch("/password/reset", changeForgetedPassword);

authRouter.delete("/users/one", identifier, deleteAccount);

authRouter.patch("/users/one", identifier, updateUserInfo);

authRouter.get("/users/one", identifier, getUser)

authRouter.get("/users/all", identifier, getAllUsers);


export default authRouter;