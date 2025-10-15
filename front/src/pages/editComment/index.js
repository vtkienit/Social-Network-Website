import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout';
import axios from 'axios';
import './style.scss';

function EditComment() {
    const baseUrl = 'https://back2-1.onrender.com';
    const { commentId } = useParams();
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(()=> {
        if(!localStorage.getItem('token')){
            navigate('/');
        }
    },[]);

    const handleDelete = async () => {
        try {
            const response= await axios.post(baseUrl+`/users/comments/delete/${commentId}`, null, {
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
            setMessage('Error deleting comment');
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.post(baseUrl+`/users/comments/${commentId}`, {content}, {
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
            setMessage(`Comment updated successfully`);
        } catch (error) {
            setMessage('Error Update');
        }
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
                <h1 className='ten'>Update Comment</h1>
                <div className="login-form">
                    <input className="userName-input" type="text" placeholder="Comment..." value={content} onChange={(e) => setContent(e.target.value)} />
                    <button className="login-btn" onClick={handleUpdate}>Update</button>
                    <br/> <br/>
                    <button className="signup-btn" onClick={handleDelete}>Delete Comment</button>
                </div>
                <p class="message">{message}</p>
            </th>
        </tr>
        </table>
    );
}

export default EditComment;
