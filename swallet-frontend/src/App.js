// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AddFundsPage from './pages/AddFundsPage';
import MyAccountPage from './pages/MyAccountPage';
import CashInLocationsPage from './pages/CashInLocationsPage'; // Import the new page
import AuthProvider from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <Container fluid className="p-0">
                <Row className="no-gutters">
                  <Sidebar />
                  <Col className="main-content p-4">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <PrivateRoute>
                            <HomePage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/add-funds"
                        element={
                          <PrivateRoute>
                            <AddFundsPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/my-account"
                        element={
                          <PrivateRoute>
                            <MyAccountPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/cash-in-locations"
                        element={
                          <PrivateRoute>
                            <CashInLocationsPage />
                          </PrivateRoute>
                        }
                      />
                      {/* Add more private routes as needed */}
                    </Routes>
                  </Col>
                </Row>
              </Container>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
