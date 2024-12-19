import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import qrIcon from '../assets/images/qr-icon.svg';
import notificationIcon from '../assets/images/notification-icon.svg';
import settingsIcon from '../assets/images/settings-icon.svg';
import searchIcon from '../assets/images/search-icon.svg';
import defaultProfile from '../assets/images/default-profile.png';

const TopBar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/my-account');
  };

  return (
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
  );
};

export default TopBar;
