import express from 'express';
import {
    signup,
    signin,
    signout,
    verifyUser,
    changePassword,
    changeForgetedPassword,
    sendVerification, sendForgotPasswordCode
} from '../controllers/authController.js';

import { identifier } from '../middlewares/identification.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);

authRouter.post('/signin', signin);

authRouter.post('/signout', identifier, signout);

authRouter.patch("/verification/send", identifier, sendVerification);

authRouter.patch("/verification/verify", identifier, verifyUser);

authRouter.patch("/password", identifier, changePassword);

authRouter.patch("/password/forget", sendForgotPasswordCode);

authRouter.patch("/password/reset", changeForgetedPassword);


export default authRouter;