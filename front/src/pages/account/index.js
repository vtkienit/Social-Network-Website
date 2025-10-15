import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout';
import axios from 'axios';
import './style.scss';

function Account() {
    const baseUrl = 'https://back2-1.onrender.com';
    const [userName, setUserName] = useState('');
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(()=> {
        if(!localStorage.getItem('token')){
            navigate('/');
        }
    },[]);

    const handleDelete = async () => {
        try {
            const response = await axios.post(baseUrl+'/users/delete', null, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(localStorage.getItem('token'))
                localStorage.removeItem('token');
            if(localStorage.getItem('userId'))
                localStorage.removeItem('userId');

            if(response.data.data==='Token missing' || response.data.data==='Token invalid'){
                navigate('/');
            }
            
            setMessage('Delete successfully');
            navigate('/');
        } catch (error) {
            setMessage(error);
        }
    };

    const handleUpdate = async () => {
        try {
            if(userName.length<8)
                setMessage('UserName must be at least 8 letters');
            else{
                const formData = new FormData();
                formData.append('userName', userName);
                formData.append('file', file);
                formData.append('password', password);

                const res = await axios.post(baseUrl+'/users/update', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if(res.data.data === 'Done')
                    setMessage('Update successfully');
                else if(res.data.data==='Token missing' || res.data.data==='Token invalid'){
                    if(localStorage.getItem('token'))
                        localStorage.removeItem('token');
                    if(localStorage.getItem('userId'))
                        localStorage.removeItem('userId');
                    navigate('/');
                }
                else setMessage('Wrong Password ');
            }
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
                <h1 className='ten'>Update Account</h1>
                <div className="login-form">
                    <div className='avatar-file'>
                        <p>Avatar: </p>
                        <input className="file-input" type="file" onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                    <input className="userName-input" type="text" placeholder="UserName" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <input className="password-input" type="password" placeholder="Type password to update" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="login-btn" onClick={handleUpdate}>Update</button>
                    <br/> <br/>
                    <button className="signup-btn" onClick={handleDelete}>Delete Account</button>
                </div>
                <p class="message">{message}</p>
            </th>
        </tr>
        </table>
    );
}

export default Account;
