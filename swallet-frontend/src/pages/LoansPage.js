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
      console.log('Loan info from API:', res.data); // Debug line
      setScore(res.data.score);
      setEligibility(res.data.eligibility);
    })
    .catch(err => console.error('Error fetching loan info:', err));
  }, [authToken]);

  return (
    <div className="main-content">
      <TopBar />
      <h2>Loans</h2>
      <Card style={{maxWidth:'400px', padding:'20px'}}>
        <h4>Your Score: {score}</h4>
        <h4>Eligible Loan Amount: ${eligibility}</h4>
        <Button disabled={eligibility === 0}>Request Loan</Button>
      </Card>
    </div>
  );
}
