import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signUp.css';


const SignUp = () => {

    const [username, setUsername] = useState('');
    const [firstname, setFirstname]     = useState('');
    const [lastname, setLastname]     = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Store user info in localStorage
      const userData = {
        username,
        firstname,
        lastname,
        password
      };
  
      localStorage.setItem('user', JSON.stringify(userData));
  
      // Navigate to SignIn page
      navigate('/signin');
    };

  return (
    <div className="main">  	
      <div className="signup">
        <form onSubmit={handleSubmit}>
          <label htmlFor="chk" aria-hidden="true">Sign up</label>
          <input type="text" name="username" placeholder="User name" value={username} onChange={(e) => setUsername(e.target.value)}required />
          <input type="text" name="firstname" placeholder="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)}required />
          <input type="text" name="lastname" placeholder="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)}required />
          <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}required />
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
