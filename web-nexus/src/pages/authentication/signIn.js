import React from 'react';
import '../css/login.css';

const SignIn = () => {
  return (
    <div className="main">
      <div className="login">
        <form>
          <label htmlFor="chk" aria-hidden="true">Login</label>
          <input type="text" name="username" placeholder="User name" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
