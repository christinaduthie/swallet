// src/pages/AddFundsPage.js

import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const AddFundsPage = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('upload'); // 'upload', 'review', 'done'

  const { authToken } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setMessage('');
    setOcrData(null);
    setStep('upload');
  };

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
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setMessage(response.data.message);
      setOcrData({ rawText: response.data.rawText });
      setStep('review');
    } catch (error) {
      console.error('Error during OCR-only step:', error);
      setMessage(error.response?.data?.message || 'OCR error');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
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

            {selectedOption === 'check' && step === 'upload' && (
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
                  <Button variant="primary" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </>
            )}

            {selectedOption === 'check' && step === 'review' && ocrData && (
              <>
                <h5>Raw Extracted OCR Text:</h5>
                {ocrData.rawText && ocrData.rawText.trim().length > 0 ? (
                  <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                    {ocrData.rawText}
                  </pre>
                ) : (
                  <Alert variant="warning">No text extracted. Try a clearer image or check OCR logs.</Alert>
                )}
              </>
            )}

            {selectedOption === 'community' && (
              <div className="mt-3">
                <Alert variant="info">CommunityBank feature coming soon!</Alert>
              </div>
            )}

            {selectedOption === 'bank' && (
              <Alert variant="info">Bank functionality coming soon!</Alert>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddFundsPage;
