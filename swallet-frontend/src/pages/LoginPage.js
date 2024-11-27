// src/pages/LoginPage.js

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    emailOrPhone: '',
    passwordOrPin: '',
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const { login, authToken } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  // Redirect to homepage if already authenticated
  useEffect(() => {
    if (authToken) {
      navigate('/');
    }
  }, [authToken, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setMessage(''); // Clear message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      login(response.data.token);
      setMessage(response.data.message);

      // Redirect to the homepage
      navigate('/'); // Navigate to the homepage upon successful login
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage(
        error.response?.data?.message || 'An error occurred during login.'
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      {message && (
        <Alert variant={message === 'Login successful.' ? 'success' : 'danger'}>
          {message}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmailOrPhone" className="mb-3">
          <Form.Label>Email or Phone</Form.Label>
          <Form.Control
            type="text"
            name="emailOrPhone"
            value={credentials.emailOrPhone}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPasswordOrPin" className="mb-3">
          <Form.Label>Password or PIN</Form.Label>
          <Form.Control
            type="password"
            name="passwordOrPin"
            value={credentials.passwordOrPin}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
