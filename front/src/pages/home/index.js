import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout';
import axios from 'axios';
import './style.scss';

function Home() {
    const baseUrl = 'https://back2-1.onrender.com';
    const [title, setTitle] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState('');

    const navigate = useNavigate();

    useEffect(()=> {
        if(!localStorage.getItem('token')){
            navigate('/');
        }
    },[]);
    
    const handleCreatePost = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);

            mediaFiles.forEach(file => {
                formData.append('files', file);
            });

            const response = await axios.post(baseUrl+'/users/posts/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(response.data.data==='Token missing' || response.data.data==='Token invalid'){
                if(localStorage.getItem('token'))
                    localStorage.removeItem('token');
                if(localStorage.getItem('userId'))
                    localStorage.removeItem('userId');
                navigate('/');
            }
            setPosts(prevPosts => [...prevPosts, response.data.data]);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get(baseUrl+'/users/posts',{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(response.data.data==='Token missing' || response.data.data==='Token invalid'){
                if(localStorage.getItem('token'))
                    localStorage.removeItem('token');
                if(localStorage.getItem('userId'))
                    localStorage.removeItem('userId');
                navigate('/');
            }
            setPosts(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddComment = async (postId, comment) => {
        try {
            const response = await axios.post(baseUrl+'/users/comments/add', { content: comment, postId: postId }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(response.data.data==='Token missing' || response.data.data==='Token invalid'){
                if(localStorage.getItem('token'))
                    localStorage.removeItem('token');
                if(localStorage.getItem('userId'))
                    localStorage.removeItem('userId');
                navigate('/');
            }
            setPosts(prevPosts => prevPosts.map(post => {
                if (post._id === postId) {
                    return {
                        ...post,
                        comments: [...post.comments, response.data.data]
                    };
                }
                return post;
            }));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect (() => {
        fetchPosts();
    },[]);
    

    const handleFileChange = (e) => {
        setMediaFiles([...e.target.files]);
    };

    const handleEditPost = (post) => {
        navigate(`/editPost/${post._id}`);
    };

    const handleEditComment = (cmtId) => {
        navigate(`/editComment/${cmtId}`);
    };

    return (
        <table className="home-container">
        <tr className='header'>
            <th className='header-th'>
                <Layout/> 
            </th>
        </tr>
        <tr className="create-post-section">
            <th>
                <input className="create-post-text-input" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input className="create-post-input" type="file" multiple onChange={handleFileChange} />
                <button className="create-post-button" onClick={handleCreatePost}>Create Post</button>
            </th>
        </tr>
        <tr className="post-list">
            {Array.isArray(posts) && posts.map(post => (
                <React.Fragment key={post._id}>
                    {post && (
                        <table className="post-item">
                            <tbody>
                                <tr>
                                    <th className='avatar-cot'>
                                        <img className="avatar" src={post.avatar} /> 
                                        <p className="user-name">{post.userName}</p> 
                                        {localStorage.getItem('userId') === post.userId && (
                                            <button className="edit-post-button" onClick={() => handleEditPost(post)}>⋮</button>
                                        )}
                                    </th>
                                </tr>
                                <tr> 
                                    <th> 
                                        <p className="post-title">{post.title}</p> 
                                    </th> 
                                </tr>
                                <tr className="post-media">
                                    <th>
                                        {post.album.map((url, index) => (
                                            <div key={index} className="media-item">
                                                <img className="image" src={url} alt={`Image ${index}`} />
                                            </div>
                                        ))}
                                    </th>
                                </tr>
                                {post.comments && post.comments.map(comment => (
                                    <tr key={comment._id}>
                                        <th>
                                            <div className='cmt0'>
                                                <div className='avatar-cot20'>
                                                    <img className="avatar-cmt" src={comment.avatarCmt} /> 
                                                    <div className='cmt2'>
                                                        <div className='avatar-cot2'>
                                                            <p className="userName-cmt">{comment.userNameCmt}</p> 
                                                            {localStorage.getItem('userId') === comment.userCmtId && (
                                                                <button className="edit-post-button" onClick={() => handleEditComment(comment.cmtId)}>⋮</button>
                                                            )}
                                                        </div>
                                                        <p className='content-cmt'>{comment.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                ))}
                                <tr>
                                    <th className='f1'>
                                        <input className="cmt-text" type="text" placeholder="Add comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
                                        <button className="cmt-btn" onClick={() => handleAddComment(post._id, comment)}> Send </button>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </React.Fragment>
            ))}
        </tr>
        </table>
    );
}

export default Home;