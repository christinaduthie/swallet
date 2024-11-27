// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const existingToken = localStorage.getItem('token');
  const [authToken, setAuthToken] = useState(existingToken);

  useEffect(() => {
    setAuthToken(existingToken);
  }, [existingToken]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    navigate('/login'); // Redirect to login page
  };

  const value = {
    authToken,
    setAuthToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
