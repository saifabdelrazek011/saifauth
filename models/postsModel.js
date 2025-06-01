import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    desciption: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

const Post = mongoose.model("Post", postSchema);

export default Post;