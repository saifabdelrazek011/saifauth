import express from 'express';
import Post from '../models/postsModel.js';
import { createPostSchema } from '../middlewares/validator.js';


export const getPosts = async (req, res) => {
    const { page } = req.query;
    const postsPerPage = 10;

    try {
        let pageNum = 0;
        if (page <= 1) {
            pageNum = 0;
        } else {
            pageNum = page - 1;
        }
        const result = await Post.find().sort({ createdAt: -1 }).skip(pageNum * postsPerPage).limit(postsPerPage).populate({
            path: "userId",
            select: 'email'

        });
        res.status(200).json({ success: true, message: "Posts", data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const createPost = async (req, res) => {
    const { title, description } = req.body;
    const { userId } = req.user;
    try {
        const { error, value } = createPostSchema.validate({ title, description, userId });

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const newPost = new Post({
            title,
            description,
            userId
        });

        const result = await newPost.save();

        res.status(201).json({ success: true, message: "Post created successfully", data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const singlePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const result = await Post.findOne({ _id: postId }).populate({
            path: "userId",
            select: 'email'
        });
        res.status(200).json({ success: true, message: "Post", data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;
    const { title, description } = req.body;
    try {
        const { error, value } = createPostSchema.validate({ title, description, userId });

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        const existingPost = await Post.findOne({ _id: postId });

        if (!existingPost) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (existingPost.userId.toString() !== userId) {
            return res.status(401).json({ success: false, message: "You are not authorized to update this post" });
        }

        const result = await Post.findOneAndUpdate({ _id: postId }, { title, description, edited: true }, { new: true });
        res.status(200).json({ success: true, message: "Post updated successfully", data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export const deletePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;
    try {
        const existingPost = await Post.findOne({ _id: postId });
        if (!existingPost) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        if (existingPost.userId.toString() !== userId) {
            return res.status(401).json({ success: false, message: "You are not authorized to delete this post" });
        }
        const result = await Post.findOneAndDelete({ _id: postId });
        res.status(200).json({ success: true, message: "Post deleted successfully", data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getUserPosts = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await Post.find({ userId }).populate({
            path: "userId",
            select: 'email'
        });
        res.status(200).json({ success: true, message: "Posts", data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
