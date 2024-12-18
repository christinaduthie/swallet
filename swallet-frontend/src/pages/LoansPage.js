import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import qrIcon from '../assets/images/qr-icon.svg';
import notificationIcon from '../assets/images/notification-icon.svg';
import settingsIcon from '../assets/images/settings-icon.svg';
import searchIcon from '../assets/images/search-icon.svg';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import defaultProfile from '../assets/images/default-profile.png';

export default function LoansPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/my-account');
  };

  return (
    <div className="main-content">
      {/* Top bar */}
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
          <img src={user?.profile_icon || defaultProfile} alt="Profile" style={{width:'50px',height:'50px',borderRadius:'50%'}}/>
        </div>
      </div>

      <Container>
        <h2>Loans</h2>
        <p>Coming soon...</p>
      </Container>
    </div>
  );
}
