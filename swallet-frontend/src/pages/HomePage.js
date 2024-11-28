import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';

const HomePage = () => {
  const { authToken } = useContext(AuthContext);
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
    <Container>
      <Row>
        <Col>
          <Card className="mb-4 custom-shadow">
            <Card.Body>
              <Card.Title>Your Wallet Balance</Card.Title>
              <Card.Text style={{ fontSize: '2em', color: '#542de8' }}>
                ${balance.toFixed(2)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
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
      </Row>
    </Container>
  );
};

export default HomePage;
