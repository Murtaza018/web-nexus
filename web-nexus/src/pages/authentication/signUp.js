import React from 'react';
import '../css/login.css';

const SignUp = () => {
  return (
    <div className="main">  	
      <div className="signup">
        <form>
          <label htmlFor="chk" aria-hidden="true">Sign up</label>
          <input type="text" name="username" placeholder="User name" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
