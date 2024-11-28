import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import NavBar from './components/NavBar';
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
        <NavBar />
        <Container fluid>
          <Row>
            <Col xs={12} lg={2} className="p-0">
              <Sidebar />
            </Col>
            <Col xs={12} lg={10} className="p-4 main-content" style={{ marginLeft: 'auto' }}>
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
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
