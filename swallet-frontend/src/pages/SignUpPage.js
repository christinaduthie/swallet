import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { LanguageContext } from '../contexts/LanguageContext';
import { t } from '../i18n';

const SignUpPage = () => {
  const { language, setLanguage } = useContext(LanguageContext);
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

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/signup`, formData);
      setMessage(t('userRegistered', language));
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
            {t('signupTitle', language)}
          </Card.Title>
          {message && <Alert variant="info">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formLanguage" className="mb-3">
              <Form.Label style={{ color: '#fff' }}>{t('selectLanguage', language)}</Form.Label>
              <Form.Select value={language} onChange={handleLanguageChange}>
                <option value="en">{t('english', language)}</option>
                <option value="es">{t('spanish', language)}</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formName" className="mb-3" style={{ color: '#fff' }}>
              <Form.Label>{t('nameLabel', language)}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3" style={{ color: '#fff' }}>
              <Form.Label>{t('emailLabel', language)}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPhone" className="mb-3" style={{ color: '#fff' }}>
              <Form.Label>{t('phoneLabel', language)}</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3" style={{ color: '#fff' }}>
              <Form.Label>{t('passwordLabel', language)}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPin" className="mb-3" style={{ color: '#fff' }}>
              <Form.Label>{t('pinLabel', language)}</Form.Label>
              <Form.Control
                type="password"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 signupButton">
              {t('signupButton', language)}
            </Button>
          </Form>
          <div className="text-center mt-3" style={{ color: '#fff' }}>
            {t('haveAccount', language)} <a href="/login">{t('loginLink', language)}</a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignUpPage;
