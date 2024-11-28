import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Container, Row, Col, Card, Table, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { authToken, user } = useContext(AuthContext);
  const [balance, setBalance] = useState(0.0);
  const [transactions, setTransactions] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const balanceResponse = await axios.get(`${API_URL}/api/wallet`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setBalance(balanceResponse.data.balance);

        const transactionsResponse = await axios.get(
          `${API_URL}/api/wallet/transactions`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setTransactions(transactionsResponse.data.transactions);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    if (authToken) {
      fetchWalletData();
    }
  }, [authToken, API_URL]);

  return (
    <Container fluid>
      <Row>
        {/* Middle Column */}
        <Col md={8}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <Card.Title>Your Wallet Balance</Card.Title>
              <Card.Text style={{ fontSize: '2em', color: '#542de8' }}>
                ${balance.toFixed(2)}
              </Card.Text>
            </Card.Body>
          </Card>

          <h3>Recent Transactions</h3>
          <Table striped bordered hover responsive>
            <thead style={{ backgroundColor: '#542de8', color: '#fff' }}>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.created_at).toLocaleString()}</td>
                  <td>{tx.type}</td>
                  <td>${tx.amount.toFixed(2)}</td>
                  <td>{tx.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* Right Column */}
        <Col md={4}>
          <Card className="text-center shadow">
            <Card.Body>
              <Image
                src={user?.profile_icon || '/assets/images/default-profile.png'}
                roundedCircle
                width="100"
                height="100"
                className="mb-3"
              />
              <Card.Title>{user?.name}</Card.Title>
              <Button as={Link} to="/my-account" variant="primary" className="mb-2">
                Edit Profile
              </Button>
              <Card.Text>Wallet ID: {user?.wallet_id}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
