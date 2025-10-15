import mongoose from 'mongoose';
import collections from '../database/collection.js';

const commentSchema = new mongoose.Schema({
    postId: String,
    content: String,
    userCmtId: String,
    userNameCmt: String,
    avatarCmt:String
});

const CommentsModel = mongoose.model(collections.COMMENTS, commentSchema);
export default CommentsModel;