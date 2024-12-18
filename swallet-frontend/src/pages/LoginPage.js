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
    <div
      className="DesktopLogin"
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        background: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="PLoginDropbox"
        style={{
          width: 550,
          height: 380,
          background: '#2b0042',
          borderRadius: 10,
          position: 'relative',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          className="TLogIn"
          style={{
            textAlign: 'center',
            color: '#fff',
            fontSize: 24,
            fontFamily: 'Arial',
            fontWeight: 700,
            marginTop: 20,
          }}
        >
          Log In
        </div>
        {message && (
          <div
            style={{
              color: 'red',
              textAlign: 'center',
              marginTop: 10,
              fontSize: 14,
            }}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Email Label */}
          <div
            className="TEmail"
            style={{
              color: '#fff',
              fontSize: 20,
              fontFamily: 'Arial',
              fontWeight: 500,
              margin: '20px 0 5px 45px',
            }}
          >
            Email
          </div>
          {/* Email Input */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: 450,
              height: 40,
              marginLeft: 45,
              background: '#D9D9D9',
              borderRadius: 12,
              border: 'none',
              padding: '10px',
              outline: 'none',
            }}
          />
          {/* Password Label */}
          <div
            className="TPassword"
            style={{
              color: '#fff',
              fontSize: 20,
              fontFamily: 'Arial',
              fontWeight: 500,
              margin: '20px 0 5px 45px',
            }}
          >
            Password
          </div>
          {/* Password Input */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: 450,
              height: 40,
              marginLeft: 45,
              background: '#D9D9D9',
              borderRadius: 12,
              border: 'none',
              padding: '10px',
              outline: 'none',
            }}
          />
          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: 450,
              height: 40,
              margin: '20px 45px',
              background: '#FF3EFF',
              color: 'white',
              fontSize: 16,
              fontFamily: 'Arial',
              fontWeight: 500,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Generate OTP
          </button>
        </form>
        {/* Footer Link */}
        <div
          style={{
            textAlign: 'center',
            color: '#fff',
            fontSize: 14,
            fontFamily: 'Arial',
            fontWeight: 500,
            marginTop: 10,
            
          }}
        >
          Don’t have an account?{' '}
          <a href="/signup" style={{ color: '#FF3EFF', textDecoration: 'none' }}>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
