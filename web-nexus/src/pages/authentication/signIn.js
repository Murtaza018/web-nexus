import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signIn.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (
      storedUser &&
      storedUser.username === username &&
      storedUser.password === password
    ) {
      alert('Login successful!');
      navigate('/Blog');
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <div className='body-su'>
    <div className="main-si">
      <div className="login-si">
        <form onSubmit={handleLogin}>
          <label htmlFor="chk" aria-hidden="true">Login</label>
          <input
            type="text"
            name="username"
            placeholder="User name"
            className='input-si'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            className='input-si'
            onChange={(e) => setPassword(e.target.value)}
            required
            />
          <button className= "button-si" type="submit">Login</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default SignIn;
