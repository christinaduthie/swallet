import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

import qrIcon from '../assets/images/qr-icon.svg';
import notificationIcon from '../assets/images/notification-icon.svg';
import settingsIcon from '../assets/images/settings-icon.svg';
import searchIcon from '../assets/images/search-icon.svg';
import defaultProfile from '../assets/images/default-profile.png';

const SendToFriendPage = () => {
  const { authToken, user } = useContext(AuthContext);
  const [swalletIdInput, setSwalletIdInput] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(res => {
        // Filter out the current logged in user
        const filteredUsers = res.data.users.filter(u => u.id !== user?.id);
        setUsers(filteredUsers);
      })
      .catch(err => console.error('Error fetching users:', err));
  }, [authToken, API_URL, user]);

  const handleNext = () => {
    if (!swalletIdInput.trim()) {
      setMessage('Please enter a Swallet ID');
      return;
    }

    axios.get(`${API_URL}/api/users/check/${swalletIdInput.trim()}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then(res => {
        if (res.data.exists) {
          navigate(`/payment?recipient=${swalletIdInput.trim()}`);
        } else {
          setMessage('Swallet ID not found.');
        }
      })
      .catch(err => {
        console.error('Error checking Swallet ID:', err);
        setMessage('Error checking Swallet ID.');
      });
  };

  const handleSend = (userObj) => {
    navigate(`/payment?recipient=${userObj.wallet_id}`);
  };

  const handleRequest = () => {
    alert('Request Money feature coming soon!');
  };

  const handleProfileClick = () => {
    navigate('/my-account');
  };

  return (
    <div className="main-content">
      <div className="top-row">
        <div className="scan-qr" style={{flex:'1'}}>
          <img src={qrIcon} alt="QR" width="20" height="20"/> Scan QR for payments
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <div className="search-icon">
            <img src={searchIcon} alt="Search" style={{width:'20px',height:'20px',marginTop:'5px',marginLeft:'5px'}}/>
          </div>
        </div>
        <div className="icon-box">
          <img src={notificationIcon} alt="Notifications" width="22" height="22"/>
        </div>
        <div className="icon-box">
          <img src={settingsIcon} alt="Settings" width="22" height="22"/>
        </div>
        <div className="welcome-text">
          <span>Welcome,</span>
          <span>{user?.name || 'User'}</span>
        </div>
        <div style={{cursor:'pointer'}} onClick={handleProfileClick}>
          <Image
            src={user?.profile_icon || defaultProfile}
            roundedCircle
            width="50"
            height="50"
          />
        </div>
      </div>

      <h2>Send to Friend</h2>
      {message && <div style={{color:'red', marginBottom:'10px'}}>{message}</div>}
      <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
        <input
          type="text"
          placeholder="Enter Swallet ID"
          value={swalletIdInput}
          onChange={(e) => setSwalletIdInput(e.target.value)}
          style={{padding:'10px', borderRadius:'5px', border:'1px solid #ccc', flex:'1'}}
        />
        <Button onClick={handleNext} style={{padding:'10px 20px', background:'#600FA0', border:'none', borderRadius:'5px'}}>
          Next
        </Button>
      </div>

      <h4>All Users</h4>
      <div className="user-list">
        {users.map(u => (
          <div className="user-list-item" key={u.id}>
            <div className="user-list-name">{u.name}</div>
            <div className="user-list-buttons">
              <button className="user-list-button" onClick={() => handleRequest(u)}>Request</button>
              <button className="user-list-button" onClick={() => handleSend(u)}>Send</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SendToFriendPage;
