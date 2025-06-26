import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import './LoginPage.css';
import gomailLogo from '../assets/gomail-logo.png';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  //getting login from auth context
  const { login } = useAuth();

  const handleLogin = async () =>{
    try {
      const res = await fetch('/api/users/tokens', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        //send login info as json
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok){
        //storing token and info in local storage and context
        login(data.token, data.user); 
        //go to inbox
        navigate('/inbox');
      }else{
        alert(data.error || 'Login failed');
      }
    }catch (err){
      alert('Network error');
    }
  };
  //render
  return(
    <div className="login-container">
      <div className="login-box">
        <img src={gomailLogo} alt="GoMail" className="gmail-logo" />
        <h2>Sign in</h2>
        <input
          type="text"
          placeholder="Email or username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <div className="register-link">
          <span>Don’t have an account? </span>
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
}
