
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import TopBar from '../components/Topbar';

export default function LoansPage() {
  const { authToken } = useContext(AuthContext);
  const [score, setScore] = useState(0);
  const [eligibility, setEligibility] = useState(0);

  useEffect(() => {
    if (!authToken) return;
    axios.get('http://localhost:5000/api/loans/info', {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    .then(res => {
      setScore(res.data.score);
      setEligibility(res.data.eligibility);
    })
    .catch(err => console.error('Error fetching loan info:', err));
  }, [authToken]);

  return (
    <div className="main-content loans-page">
      <TopBar />
      <div className="microloans-title">Microloans</div>

      <div className="loan-cards-row">
        <Card className="loan-card">
          <div className="loan-card-title">Your Score</div>
          <div className="loan-card-value">{score}</div>
        </Card>
        <Card className="loan-card">
          <div className="loan-card-title">Credit Available</div>
          <div className="loan-card-value">${eligibility}</div>
        </Card>
      </div>

      <div className="loan-cards-row">
        <Card className="loan-card">
          <Button variant="primary" className="repay-loan-button">
            Repay Loan
          </Button>
        </Card>
        <Card className="loan-card"></Card>
      </div>
    </div>
  );
}
