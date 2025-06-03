import express from 'express';
import { getPosts, createPost, singlePost, updatePost, deletePost, getUserPosts } from '../controllers/postsController.js';
import { identifier } from '../middlewares/identification.js';

const postsRouter = express.Router();

postsRouter.get('/', getPosts);

postsRouter.get('/:postId', singlePost);

postsRouter.post('/', identifier, createPost);

postsRouter.put("/:postId", identifier, updatePost);

postsRouter.delete("/:postId", identifier, deletePost);

postsRouter.get("/users/:userId", identifier, getUserPosts);



export default postsRouter;