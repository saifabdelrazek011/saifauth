import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import authRouter from './routers/authRouter.js';
import arcjectMiddleware from './middlewares/arcjetMiddleware.js';
import postsRouter from './routers/postsRouter.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

app.use('/api/v1/auth', arcjectMiddleware, authRouter);
app.use('/api/v1/posts', arcjectMiddleware, postsRouter);


app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port ' + process.env.PORT || 3000);
});