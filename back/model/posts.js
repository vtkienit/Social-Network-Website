import mongoose from 'mongoose';
import collections from '../database/collection.js';

const postSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    avatar: String,
    title: String,
    album:[{
        type: String
    }],
    comments:[{
        cmtId: String,
        postId:String,
        userCmtId: String,
        avatarCmt: String,
        userNameCmt: String,
        content: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PostsModel = mongoose.model(collections.POSTS, postSchema);
export default PostsModel;