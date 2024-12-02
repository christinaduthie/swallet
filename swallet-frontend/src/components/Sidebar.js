import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    setExpanded(false); // Close sidebar after logout
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const closeSidebar = () => {
    setExpanded(false);
  };
  return (
    <>
      {/* Navbar for small screens */}
      <Navbar
        expand="lg"
        variant="dark"
        className="d-lg-none"
        style={{ backgroundColor: '#542de8' }}
      >
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          Swallet
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="sidebar-navbar-nav" onClick={toggleSidebar} />
      </Navbar>

      {/* Overlay */}
      {expanded && <div className="overlay" onClick={closeSidebar}></div>}

      <div className={`sidebar ${expanded ? 'active' : ''}`}>
        <Navbar.Brand as={Link} to="/" className="d-none d-lg-block navbar-brand">
          Swallet
        </Navbar.Brand>
        <Nav defaultActiveKey="/" className="flex-column">
          <Nav.Link
            as={Link}
            to="/"
            active={currentPath === '/'}
            onClick={closeSidebar}
          >
            Home
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/add-funds"
            active={currentPath === '/add-funds'}
            onClick={closeSidebar}
          >
            Add Funds
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/cash-in-locations"
            active={currentPath === '/cash-in-locations'}
            onClick={closeSidebar}
          >
            Cash In Locations
          </Nav.Link>
          {/* Add more navigation links as needed */}
        </Nav>

        <Button variant="danger" className="logout-button" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
