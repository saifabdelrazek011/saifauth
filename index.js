import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import authRouter from './routers/authRouter.js';
import arcjectMiddleware from './middlewares/arcjetMiddleware.js';
import postsRouter from './routers/postsRouter.js';
import { MONGODB_URI, PORT } from './config/env.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

app.use('/v1/auth', arcjectMiddleware, authRouter);
app.use('/v1/posts', arcjectMiddleware, postsRouter);


app.get('/', (req, res) => {
    return res.render('index');
});

app.listen(PORT || 3000, () => {
    console.log('Server is running on port ' + PORT || 3000);
});