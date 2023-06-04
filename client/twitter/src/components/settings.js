import './style.css';
import './settings.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsernameCheck, setNewUsernameCheck] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/feed');
        const data = await response.json();
        if (response.ok) {
          setDate(data.user.created);
          setUsername(data.user.username);
          setPassword(data.user.password);
          setLoading(false);
        } else {
          console.log(data.message);
          navigate('/');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [navigate]);

  const toggle1 = async (event) => {
    setMessage('');
    setNewUsername('');
    setNewPassword('');
    setNewUsernameCheck('');
    setNewPasswordCheck('');
    const popup = document.querySelector('.popup1');
    if (popup.style.display === 'none') {
      popup.style.display = 'block';
    } else {
      popup.style.display = 'none';
    }
  };

  const toggle2 = async (event) => {
    setMessage('');
    setNewUsername('');
    setNewPassword('');
    setNewUsernameCheck('');
    setNewPasswordCheck('');
    const popup = document.querySelector('.popup2');
    if (popup.style.display === 'none') {
      popup.style.display = 'block';
    } else {
      popup.style.display = 'none';
    }
  };

  const toggle3 = async (event) => {
    const popup = document.querySelector('.popup3');
    if (popup.style.display === 'none') {
      popup.style.display = 'block';
    } else {
      popup.style.display = 'none';
    }
  };

  const handleSubmitUsername = async (event) => {
    event.preventDefault();
    const response = await fetch('/username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, username1: newUsername, username2: newUsernameCheck })
    });
    const data = await response.json();
    if (response.ok) {
      window.location.reload();
    } else {
      setMessage(data.message);
    }
  };

  const handleSubmitPassword = async (event) => {
    event.preventDefault();
    const response = await fetch('/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password1: newPassword, password2: newPasswordCheck })
    });
    const data = await response.json();
    if (response.ok) {
      window.location.reload();
    } else {
      setMessage(data.message);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await fetch('/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username })
    });
    const data = await response.json();
    console.log(data);
    window.location.reload();
  }; 

  const isUsernameEmpty = newUsername === '';
  const isPasswordEmpty = newPassword === '';
  const isUsernameCheckEmpty = newUsernameCheck === '';
  const isPasswordCheckEmpty = newPasswordCheck === '';

  if (loading) {
    return (<div>loading...</div>)
  }
  
  return (
    <div>
      <div className="settings-page">
        <h1 className="page-title">Your Account</h1>
        <div className="button-container">
          <button className="settings-button" onClick={toggle1}>Change Username</button>
          <button className="settings-button" onClick={toggle2}>Change Password</button>
          <button className="settings-button" onClick={toggle3}>Delete Account</button>
          <Link to="/feed"><div id="back1"><img id="back-img1" alt="" src="/back.png"></img></div></Link>
        </div>
      </div>
      <div class="popup1">
        <div class="popup-content1">
        <div className="usernameTitle">Change Username</div>
        <div className="message">current username: {username}</div>
        {message && <div className="message" style={{ color: 'red'}}>{message}</div>}
          <form>
            <input id="username-text1" name="username" placeholder="new username..." onChange={e => setNewUsername(e.target.value)}></input>
            <input id="username-text2" name="username" placeholder="new username..." onChange={e => setNewUsernameCheck(e.target.value)}></input>
            <div class="popup-buttons1">
              <button class="popup-button1" type="button" onClick={toggle1}>Cancel</button>
              <button class="popup-button1" type="button" onClick={handleSubmitUsername} disabled={isUsernameEmpty || isUsernameCheckEmpty}>Submit</button>
            </div>
          </form>
        </div>
      </div>
      <div class="popup2">
        <div class="popup-content2">
          <div className="passwordTitle">Change Password</div>
          {message && <div className="message" style={{ color: 'red'}}>{message}</div>}
          <form>
            <input id="password-text1" name="password" placeholder="new password..." onChange={e => setNewPassword(e.target.value)}></input>
            <input id="password-text2" name="password" placeholder="new password..." onChange={e => setNewPasswordCheck(e.target.value)}></input>
            <div class="popup-buttons2">
              <button class="popup-button2" type="button" onClick={toggle2}>Cancel</button>
              <button class="popup-button2" type="button" onClick={handleSubmitPassword} disabled={isPasswordEmpty || isPasswordCheckEmpty}>Submit</button>
            </div>
          </form>
        </div>
      </div>
      <div class="popup3">
        <div class="popup-content3">
          <form>
            <div id="delete-text">Are you sure you want to delete your account? You've been a member since {new Date(date).toLocaleDateString('default', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}.
            </div>
            <div class="popup-buttons3">
              <button class="popup-button3" type="button" onClick={toggle3}>Cancel</button>
              <button class="popup-button-delete" type="button" onClick={handleDelete}>Delete</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;