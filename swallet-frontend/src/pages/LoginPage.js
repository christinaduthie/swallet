import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      login(response.data.token);
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      setMessage(
        error.response?.data?.message || 'An error occurred during login.'
      );
    }
  };

  return (
    <div className="form-container">
      <div className="login-signup-box">
        <div className="login-signup-title">Log In</div>
        {message && (
          <div className="login-signup-message">{message}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-label-custom">Email</div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input-custom"
          />
          <div className="form-label-custom">Password</div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input-custom"
          />
          <button type="submit" className="submit-button">
            Generate OTP
          </button>
        </form>
        <div className="login-signup-footer">
          Don’t have an account?{' '}
          <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
