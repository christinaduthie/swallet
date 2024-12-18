import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Card, Image, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import qrIcon from '../assets/images/qr-icon.svg';
import notificationIcon from '../assets/images/notification-icon.svg';
import settingsIcon from '../assets/images/settings-icon.svg';
import searchIcon from '../assets/images/search-icon.svg';
import sendIcon from '../assets/images/send-icon.svg';
import addIcon from '../assets/images/add-icon.svg';
import moreIcon from '../assets/images/more-icon.svg';
import defaultProfile from '../assets/images/default-profile.png'; // Placeholder image
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const userIcon = L.icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize:[25,41],
  iconAnchor:[12,41]
});

const HomePage = () => {
  const { authToken, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0.0);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]); // state to hold all users
  const [mapInstance, setMapInstance] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balanceResponse = await axios.get(`${API_URL}/api/wallet`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const balanceValue = Number(balanceResponse.data.balance) || 0.0;
        setBalance(balanceValue);

        const transactionsResponse = await axios.get(
          `${API_URL}/api/wallet/transactions`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const txs = transactionsResponse.data.transactions.map(tx => ({
          ...tx,
          amount: Number(tx.amount) || 0.0
        }));
        setTransactions(txs);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    if (authToken) {
      fetchData();
    }
  }, [authToken, API_URL]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (authToken) {
      fetchUsers();
    }
  }, [authToken, API_URL]);

  const handleProfileClick = () => {
    navigate('/my-account');
  };

  const handleMapClick = () => {
    navigate('/community-banks');
  };

  return (
    <div className="main-content">
      {/* Top Row */}
      <div className="top-row">
        <div className="scan-qr" style={{flex:'1'}}>
          <img src={qrIcon} alt="QR" width="20" height="20"/>
          Scan QR for payments
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
            src={user?.profile_icon || '/assets/images/default-profile.png'}
            roundedCircle
            width="50"
            height="50"
          />
        </div>
      </div>

      {/* Two Cards Row */}
      <div className="cards-row">
        <Card style={{flex:'1',minWidth:'300px'}}>
          <Card.Body>
            <h4 className="card-title-custom">Your Digital Wallet Card</h4>
            <img src="https://via.placeholder.com/350x199" alt="Card" style={{width:'100%',borderRadius:'15px'}}/>
          </Card.Body>
        </Card>

        <Card style={{flex:'1',minWidth:'300px'}}>
          <Card.Body>
            <h4 className="card-title-custom">Your Digital Wallet Account</h4>
            <div className="wallet-balance">${Number(balance).toFixed(2)}</div>
            <div className="actions-row">
              <div className="action-icon">
                <img src={sendIcon} alt="Send"/>
                <span>Send</span>
              </div>
              <div className="action-icon">
                <img src={addIcon} alt="Add"/>
                <span>Add</span>
              </div>
              <div className="action-icon">
                <img src={moreIcon} alt="More"/>
                <span>More</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Next Row: Cash-in locations and Quick Pay */}
      <div className="cards-row">
        <Card style={{flex:'1',minWidth:'300px'}}>
          <Card.Body>
            <h4 className="card-title-custom">Cash-in locations</h4>
            <div style={{cursor:'pointer'}} onClick={handleMapClick}>
              <div className="map-container" style={{height:'300px'}}>
                <MapContainer
                  center={[39.8283, -98.5795]} 
                  zoom={4}
                  style={{ height: '100%', width: '100%' }}
                  whenCreated={setMapInstance}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[39.8283, -98.5795]} icon={userIcon}>
                    <Popup>Click map to open Community Banks page</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Quick Pay */}
        <Card style={{flex:'1',minWidth:'300px'}}>
          <Card.Body>
            <h4 className="card-title-custom">Quick Pay</h4>
            {/* Display all users from db */}
            <div className="users-row" style={{display:'flex',flexWrap:'wrap',gap:'20px',marginTop:'20px'}}>
              {users.map(u => (
                <div key={u.id} style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <div style={{
                    width:'50px',
                    height:'50px',
                    borderRadius:'50%',
                    backgroundColor:'#D9D9D9',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center'
                  }}>
                    <img src={u.profile_icon || defaultProfile} alt={u.name} style={{width:'40px',height:'40px',borderRadius:'50%'}}/>
                  </div>
                  <span style={{fontSize:'14px',color:'black',marginTop:'5px'}}>{u.name}</span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Next Row: Recent Transactions */}
      <div className="cards-row" style={{flexDirection:'column'}}>
        <Card>
          <Card.Body>
            <h4 className="card-title-custom">Recent Transactions</h4>
            <Table striped bordered hover responsive className="recent-tx-table">
              <thead style={{ backgroundColor: '#542de8', color: '#fff' }}>
                <tr>
                  <th>Transaction Date</th>
                  <th>Recipient</th>
                  <th>Status</th>
                  <th>Mode</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const txDate = new Date(tx.created_at).toLocaleString();
                  const recipient = tx.description || 'N/A';
                  const status = 'Completed';
                  const mode = tx.type || 'N/A';
                  const amt = `$${Number(tx.amount).toFixed(2)}`;
                  return (
                    <tr key={tx.id}>
                      <td>{txDate}</td>
                      <td>{recipient}</td>
                      <td>{status}</td>
                      <td>{mode}</td>
                      <td>{amt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
