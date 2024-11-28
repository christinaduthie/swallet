import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const existingToken = localStorage.getItem('token');
  const [authToken, setAuthToken] = useState(existingToken);
  const [user, setUser] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (authToken) {
      // Fetch user data
      axios
        .get(`${API_URL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setAuthToken(null);
          localStorage.removeItem('token');
        });
    }
  }, [authToken, API_URL]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  const value = {
    authToken,
    user,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
