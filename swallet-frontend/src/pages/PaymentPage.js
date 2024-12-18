import React, { useEffect, useState, useContext } from 'react';
import TopBar from '../components/Topbar';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentPage = () => {
  const { authToken, user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const query = useQuery();
  const recipientId = query.get('recipient');
  
  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!recipientId) {
      setMessage('No recipient specified.');
      return;
    }

    axios.get(`${API_URL}/api/users/check/${recipientId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    .then(res => {
      if (res.data.exists) {
        setRecipient(res.data.user);
      } else {
        setMessage('Recipient not found.');
      }
    })
    .catch(err => {
      console.error('Error fetching recipient:', err);
      setMessage('Error fetching recipient');
    });
  }, [recipientId, API_URL, authToken]);

  const handleSend = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage('Enter a valid amount.');
      return;
    }

    axios.post(`${API_URL}/api/funds/transfer`, {
      recipientSwalletId: recipientId,
      amount: amount
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    .then(res => {
      setMessage(res.data.message);
      // After a short delay, navigate back to Transactions
      setTimeout(() => {
        navigate('/transactions');
      }, 2000);
    })
    .catch(err => {
      console.error('Error sending money:', err);
      setMessage(err.response?.data?.message || 'Error sending money.');
    });
  };

  return (
    <>
      <TopBar />
      <div className="main-content">
        {message && (
          <div style={{color:'red', marginBottom:'10px', textAlign:'center'}}>
            {message}
          </div>
        )}
        <Card style={{maxWidth:'400px', margin:'0 auto', padding:'20px', borderRadius:'15px'}}>
          <Card.Body>
            <div
              style={{
                color:'#600FA0',
                fontSize:'24px',
                fontFamily:'Inter',
                fontWeight:'700',
                textAlign:'center'
              }}
            >
              Pay
            </div>
            {recipient && (
              <>
                <div
                  style={{
                    color:'black',
                    textAlign:'center',
                    marginTop:'10px'
                  }}
                >
                  Paying {recipient.name}
                </div>
                <div
                  style={{
                    color:'black',
                    fontSize:'14px',
                    fontFamily:'Inter',
                    fontWeight:'400',
                    marginTop:'20px',
                    textAlign:'center'
                  }}
                >
                  Choose amount to transfer.
                </div>
                <Form.Group className="mt-3">
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                      color:'#600FA0',
                      fontSize:'32px',
                      fontFamily:'Inter',
                      fontWeight:'700',
                      textAlign:'center'
                    }}
                  />
                </Form.Group>
                <div
                  style={{
                    textAlign:'center',
                    marginTop:'20px',
                    fontSize:'14px'
                  }}
                >
                  Paying from {user?.name}'s Swallet.
                </div>
                <Button
                  variant="primary"
                  className="w-100 mt-3"
                  onClick={handleSend}
                >
                  Send
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default PaymentPage;
