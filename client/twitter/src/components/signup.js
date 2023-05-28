import './signup.css'
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password1: password1, password2: password2 })
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data.message)
      navigate('/login')
    } else {
      setMessage(data.message);
    }
  };  

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="box">
      <form onSubmit={handleSubmit} className="form">
        <img src="favicon.ico" alt="" />
        <h1 className="form-title">Sign Up</h1>
        {message && <div style={{ color: 'red'}}>{message}</div>}
        <br></br>
        <div className="form-group">
          <input type="text" className="form-control" required value={username} onChange={e => setUsername(e.target.value)} />
          <label htmlFor="" className="form-label">Username</label>
        </div>
        <div className="form-group">
          <input type={showPassword ? 'text' : 'password'} className="form-control" required id="txtPassword" value={password1} onChange={e => setPassword1(e.target.value)} />
          <label htmlFor="" className="form-label">Password</label>
        </div>
        <div className="form-group">
          <input type={showPassword ? 'text' : 'password'} className="form-control" required id="txtPassword" value={password2} onChange={e => setPassword2(e.target.value)} />
          <label htmlFor="" className="form-label">Password</label>
        </div>
        <div className="form-group">
          <input type="checkbox" id="show" checked={showPassword} onChange={handleCheckboxChange}/>
          Show Password
        </div>
        <div className="bottom-box">
          <a href="/">Forget password ?</a>
          <button type="submit" className="form-button">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;