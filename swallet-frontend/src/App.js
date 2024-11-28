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
import AuthProvider from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <Container fluid className="p-0">
                <Row noGutters>
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
