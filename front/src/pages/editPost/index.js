import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout';
import axios from 'axios';
import './style.scss';

function EditPost() {
    const baseUrl = 'https://back2-1.onrender.com';
    const { postId } = useParams();
    const [title, setTitle] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(()=> {
        if(!localStorage.getItem('token')){
            navigate('/');
        }
    },[]);

    const handleDelete = async () => {
        try {
            const response = await axios.post(baseUrl+`/users/posts/delete/${postId}`, null, {
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
            setMessage('Delete successfully');
        } catch (error) {
            setMessage('Error deleting post');
        }
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);

            mediaFiles.forEach(file => {
                formData.append('files', file);
            });

            const response = await axios.post(baseUrl+`/users/posts/${postId}`, formData, {
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
            setMessage(`Post updated successfully`);
        } catch (error) {
            setMessage('Error Update');
        }
    };

    const handleFileChange = (e) => {
        setMediaFiles([...e.target.files]);
    };

    return (
        <table className="home-container">
        <tr className='header'>
            <th className='header-th'>
                <Layout/> 
            </th>
        </tr>
        <tr>
            <th className="container">
                <h1 className='ten'>Update Post</h1>
                <div className="login-form">
                    <input className="userName-input" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <div className='avatar-file'>
                        <p>Files</p>
                        <input className="file-input" type="file" multiple onChange={handleFileChange} />
                    </div>
                    <button className="login-btn" onClick={handleUpdate}>Update</button>
                    <br/> <br/>
                    <button className="signup-btn" onClick={handleDelete}>Delete Post</button>
                </div>
                <p class="message">{message}</p>
            </th>
        </tr>
        </table>
    );
}

export default EditPost;
