import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';
import gomailLogo from '../assets/gomail-logo.png';

export default function RegisterPage() {
  //variables for input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  //storing image
  const [image, setImage] = useState(null); 
  const navigate = useNavigate();

  const handleRegister = async () =>{
    //checking if password matched
    if (password !== confirmPassword){
      alert('Passwords do not match');
      return;
    }
    //condition for password length and charactres
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if ((!passwordRegex.test(password))){
      alert('Password must be at least 8 characters and include a letter, number, and special character.');
      return;
    }
    //request body
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('image', image);
    try{
      const res = await fetch('/api/users', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok){
        //registered succesfully ==> go to login
        navigate('/');
      }else{
        alert(data.error || 'Registration failed');
      }
    }catch (err){
      alert('Network error');
    }
  };
  //render
  return(
    <div className="register-container">
      <div className="register-box">
        <img src={gomailLogo} alt="GoMail" className="gmail-logo" />
        <h2>Create your GoMail account</h2>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Email or username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          placeholder="Add a profile picture"
          onChange={e => setImage(e.target.files[0])}
          required
        />
        <button onClick={handleRegister}>Register</button>
        <div className="login-link">
          <span>Already have an account? </span>
          <Link to="/">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
