// src/pages/HomePage.js

import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Container, Button } from 'react-bootstrap';

const HomePage = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <Container className="mt-5">
      <h1>Welcome to Swallet Home Page</h1>
      <p>This is your dashboard.</p>
      <Button variant="primary" onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default HomePage;
