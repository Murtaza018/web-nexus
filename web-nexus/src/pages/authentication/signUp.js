import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast"
import './signUp.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Store user info in localStorage
        const userData = {
            username,
            firstname,
            lastname,
            password,
        };

        localStorage.setItem('user', JSON.stringify(userData));

        // Navigate to SignIn page
        toast.success('Signed up successfully!')
        navigate('/signin');
    };

    return (
        <div className='body-su'>
        <div className="main-su">
            <div className="signup-su">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="chk" aria-hidden="true">Sign up</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="User name"
                        className='input-su'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        />
                    <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={firstname}
                        className='input-su'
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                        />
                    <input
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        className='input-su'
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                        />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className='input-su'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    <button className='button-su' type="submit">Sign up</button>
                </form>
            </div>
        </div>
    </div>
    );
};

export default SignUp;
