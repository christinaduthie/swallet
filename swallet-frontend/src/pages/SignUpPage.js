import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    pin: '',
  });
  const [message, setMessage] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/signup`, formData);
      setMessage('Registration successful! Please log in.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        pin: '',
      });
    } catch (error) {
      console.error('Error during sign-up:', error);
      setMessage(
        error.response?.data?.message || 'An error occurred during sign-up.'
      );
    }
  };

  return (
    <div className="signup-container">
      <Card className="signup-card">
        <Card.Body>
          <Card.Title className="text-center" style={{ color: '#fff' }}>
            Sign Up
          </Card.Title>
          {message && <Alert variant="info">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* Form fields */}
            <Form.Group controlId="formName" className="mb-3" style={{ color: '#fff' }}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3" style={{ color: '#fff' }}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhone" className="mb-3" style={{ color: '#fff' }}>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3" style={{ color: '#fff' }}>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPin" className="mb-3" style={{ color: '#fff' }}>
              <Form.Label>PIN</Form.Label>
              <Form.Control
                type="password"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 signupButton">
              Sign Up
            </Button>
          </Form>
          <div className="text-center mt-3" style={{ color: '#fff' }}>
            Already have an account? <a href="/login">Log In</a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignUpPage;
