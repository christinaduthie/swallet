import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51QXC5nAWCC9o3DXwlovhvm07MexKRMik1Eg8vWN4eNPP34DljL7WTKBPZq1a9B4w7lc9anOJvADuhTrkWFYf2u4o00Y8XziX9o'); // Replace with your publishable key

function BankPaymentForm({ authToken }) {
  const API_URL = process.env.REACT_APP_API_URL;
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const cardElementOptions = {
    hidePostalCode: false,
    style: { base: { fontSize: '16px' } }
  };

  const handleAddFundsFromCard = async () => {
    if (!stripe || !elements) {
      setMessage('Stripe is not loaded yet. Please wait.');
      return;
    }

    if (!amount) {
      setMessage('Please enter an amount.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

    if (error) {
      console.error('Stripe createPaymentMethod error:', error);
      setMessage(error.message);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/funds/add-from-card`,
        { paymentMethodId: paymentMethod.id, amount: amount },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setMessage(response.data.message + ` New Balance: ${response.data.newBalance.toFixed(2)}`);
    } catch (err) {
      console.error('Add funds error:', err);
      setMessage(err.response?.data?.message || 'Error adding funds.');
    }
  };

  return (
    <>
      {message && <Alert variant="info">{message}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Card Details (Postal Code included by Stripe)</Form.Label>
        <div style={{ border: '1px solid #ced4da', borderRadius: '5px', padding: '10px' }}>
          <CardElement options={cardElementOptions} />
        </div>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 100.00"
        />
      </Form.Group>
      <Button variant="primary" onClick={handleAddFundsFromCard}>Add Funds</Button>
    </>
  );
}

function CheckDepositForm({ authToken }) {
  const API_URL = process.env.REACT_APP_API_URL;

  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('upload');
  const [rawText, setRawText] = useState('');

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleFrontChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setFrontImage(base64);
    }
  };

  const handleBackChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setBackImage(base64);
    }
  };

  const handleNext = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/check-deposits/ocr-only`,
        { frontImage, backImage },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setMessage(response.data.message);
      setRawText(response.data.rawText);
      setStep('review');
    } catch (error) {
      console.error('Error during OCR-only step:', error);
      setMessage(error.response?.data?.message || 'OCR error');
    }
  };

  const handleFinalize = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/check-deposits/finalize`,
        { rawText },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setMessage(response.data.message + ` CheckNo: ${response.data.data.checkNumber}, Amount: ${response.data.data.amount.toFixed(2)}`);
    } catch (error) {
      console.error('Error finalizing deposit:', error);
      setMessage(error.response?.data?.message || 'Error finalizing deposit');
    }
  };

  return (
    <>
      {message && <Alert variant="info">{message}</Alert>}
      {step === 'upload' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Front of Check</Form.Label>
            <Form.Control type="file" onChange={handleFrontChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Back of Check</Form.Label>
            <Form.Control type="file" onChange={handleBackChange} />
          </Form.Group>
          {frontImage && backImage && (
            <Button variant="primary" onClick={handleNext}>Next</Button>
          )}
        </>
      )}
      {step === 'review' && (
        <>
          <h5>Raw Extracted OCR Text:</h5>
          {rawText && rawText.trim().length > 0 ? (
            <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
              {rawText}
            </pre>
          ) : (
            <Alert variant="warning">No text extracted. Try a clearer image.</Alert>
          )}
          {rawText && rawText.trim().length > 0 && (
            <Button variant="primary" onClick={handleFinalize}>Submit</Button>
          )}
        </>
      )}
    </>
  );
}

function AddFundsForm({ authToken }) {
  const API_URL = process.env.REACT_APP_API_URL;
  const [selectedOption, setSelectedOption] = useState('');
  const [message, setMessage] = useState('');

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setMessage('');
  };

  return (
    <Card style={{ width: '600px' }} className="p-4">
      <Card.Body>
        <Card.Title className="text-center" style={{ color: '#542de8', fontSize: '2em' }}>
          Add Funds
        </Card.Title>
        {message && <Alert variant="info">{message}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Check
              type="radio"
              label="Bank"
              name="fundOption"
              value="bank"
              onChange={handleOptionChange}
              checked={selectedOption === 'bank'}
            />
            <Form.Check
              type="radio"
              label="Check deposit"
              name="fundOption"
              value="check"
              onChange={handleOptionChange}
              checked={selectedOption === 'check'}
            />
            <Form.Check
              type="radio"
              label="CommunityBank"
              name="fundOption"
              value="community"
              onChange={handleOptionChange}
              checked={selectedOption === 'community'}
            />
          </Form.Group>

          {selectedOption === 'bank' && (
            <BankPaymentForm authToken={authToken} />
          )}

          {selectedOption === 'check' && (
            <CheckDepositForm authToken={authToken} API_URL={API_URL} />
          )}

          {selectedOption === 'community' && (
            <Alert variant="info">CommunityBank feature coming soon!</Alert>
          )}

        </Form>
      </Card.Body>
    </Card>
  );
}

export default function TransactionsPage() {
  const { authToken } = useContext(AuthContext);
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Elements stripe={stripePromise}>
        <AddFundsForm authToken={authToken} />
      </Elements>
    </Container>
  );
}
