// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TransactionsPage from './pages/TransactionsPage';
import MyAccountPage from './pages/MyAccountPage';
import CommunityBanksPage from './pages/CommunityBanksPage'; 
import LoansPage from './pages/LoansPage';
import RewardsPage from './pages/RewardsPage';
import LearnPage from './pages/LearnPage';
import HelpCenterPage from './pages/HelpCenterPage';
import SendToFriendPage from './pages/SendToFriendPage';
import PaymentPage from './pages/PaymentPage';
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
                  {/* main-content margin handled in global.css */}
                  <Col className="p-4">
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
                        path="/transactions"
                        element={
                          <PrivateRoute>
                            <TransactionsPage />
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
                        path="/community-banks"
                        element={
                          <PrivateRoute>
                            <CommunityBanksPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/loans"
                        element={
                          <PrivateRoute>
                            <LoansPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/rewards"
                        element={
                          <PrivateRoute>
                            <RewardsPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/learn"
                        element={
                          <PrivateRoute>
                            <LearnPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/help-center"
                        element={
                          <PrivateRoute>
                            <HelpCenterPage />
                          </PrivateRoute>
                        }
                      />
                      <Route path="/send-to-friend" element={<PrivateRoute><SendToFriendPage /></PrivateRoute>} />
+                     <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
                    
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
