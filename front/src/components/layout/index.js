import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.scss'

function Layout() {
    const baseUrl = 'https://back2-1.onrender.com';
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [avatar, setAvatar] = useState('');

    const fetchUser = async () => {
        try {
            const response = await axios.get(baseUrl+'/users/user',{
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
            setUserName(response.data.data.userName);
            setAvatar(response.data.data.avatar);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(()=> {
        fetchUser();
    },[]);

    const handleLogout = async () => {
        try {
            if(localStorage.getItem('token'))
                localStorage.removeItem('token');
            if(localStorage.getItem('refreshToken')){
                await axios.post(baseUrl+'/users/refreshToken/delete', null, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
                    }
                });
                localStorage.removeItem('refreshToken');
            }
            if(localStorage.getItem('userId'))
                localStorage.removeItem('userId');
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <table class="navigation-buttons">
            <tr>
                <th className='m1'> <button class="btn btn-home-layout" onClick={() => { navigate('/home'); }}>Home</button> </th>
                <th className='m2'> <button class="btn btn-personal-layout" onClick={() => { navigate('/personal'); }}>Personal</button> </th>
                <th className='j2'> 
                    <button class="btn btn-account-layout" onClick={() => { navigate('/account'); }}>Account</button> 
                    <div className='j1'>
                        <p>{`Hello, ${userName}`}</p>
                        <img className='avatar-header' src={avatar} />
                        {localStorage.getItem('token') ? (
                        <button class="btn-signout" onClick={handleLogout}>Logout</button>
                        ) : (
                            <button class="btn-signin" onClick={() => {navigate('/'); }}>Login</button>
                        )} 
                    </div>
                </th>
            </tr>
        </table>
    );
}

export default Layout;
