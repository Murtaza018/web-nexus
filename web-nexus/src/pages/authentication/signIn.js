import React from 'react';
import { useState } from 'react';
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
        navigate('/Blog')
    } else {
      alert('Invalid credentials!');
    }
  };
  return (
    <div className="main">
      <div className="login">
        <form onSubmit={handleLogin}>
          <label htmlFor="chk" aria-hidden="true">Login</label>
          <input type="text" name="username" placeholder="User name" value={username} onChange={(e) => setUsername(e.target.value)}required />
          <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
