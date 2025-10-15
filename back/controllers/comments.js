import UsersModel from '../model/users.js';
import PostsModel from '../model/posts.js';
import CommentsModel from '../model/comments.js';
import jwt from 'jsonwebtoken'

const commentsController = {
    createNewComment: async (req, res) => {
        try {
            const { postId, content } = req.body;

            if (!postId || !content) 
                throw new Error("Du lieu dau vao co loi.");
            
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, 'hoan');
            const user = await UsersModel.findById(decodedToken.userId);
            if (!user)
                throw new Error("User not found.");

            const post = await PostsModel.findById(postId);
            if (!post)
                throw new Error("Post not found.");

            const createdComment = await CommentsModel.create({
                postId: post._id,
                content: content,
                userCmtId: user._id,
                userNameCmt: user.userName,
                avatarCmt: user.avatar
            });

            post.comments.push({
                cmtId: createdComment._id,
                postId: post._id,
                userCmtId: user._id,
                userNameCmt: user.userName,
                avatarCmt: user.avatar,
                content: content
            });
    
            await post.save();

            res.status(201).send({
                data:{                
                    cmtId: createdComment._id,
                    postId: post._id,
                    userCmtId: user._id,
                    userNameCmt: user.userName,
                    avatarCmt: user.avatar,
                    content: content
                }
            });
        } catch (error) {
            res.status(403).send({ message: error.message});
        }
    },
    updateComment: async (req, res) => {
        try {
            const { commentId } = req.params;
            const { content } = req.body;
    
            if (!content ) 
                throw new Error("Du lieu dau vao co loi.");
    
            const existComment = await CommentsModel.findById(commentId);
            if (!existComment) 
                throw new Error('Comment is not found');
    
            existComment.content = content;
            await existComment.save();

            const post = await PostsModel.findById(existComment.postId);
            if (!post)
                throw new Error("Post not found.");
    
            const commentIndex = post.comments.findIndex(comment => comment.cmtId === commentId);
            if (commentIndex !== -1) {
                post.comments[commentIndex].content = content;
                await post.save();
            }
    
            res.status(200).send({ data: existComment });
        } catch (error) {
            res.status(403).send({ message: error.message });
        }
    },
    deleteComment: async (req, res) => {
        try {
            const {commentId} = req.params;
    
            if (!commentId) 
                throw new Error("Du lieu dau vao co loi.");
    
            const deletedComment = await CommentsModel.findByIdAndDelete(commentId);
            if (!deletedComment) {
                throw new Error('Comment not found');
            }

            const post = await PostsModel.findOneAndUpdate(
                { "comments.cmtId": commentId },
                { $pull: { comments: { cmtId: commentId } } },
                { new: true }
            );
    
            if (!post) 
                throw new Error('Post not found');
    
            res.status(200).send({ message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(500).send({message: 'Internal server error'});
        }
    },
    deleteAllComments: async (req, res) => {
        try {
            const deletedComment = await CommentsModel.deleteMany();
            if (!deletedComment) {
                throw new Error('Comments not found');
            }
    
            res.status(200).send({ message: 'All Comments deleted successfully' });
        } catch (error) {
            res.status(500).send({message: 'Internal server error'});
        }
    }
}
export default commentsController;