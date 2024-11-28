import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="sidebar d-none d-lg-block">
      <Nav defaultActiveKey="/" className="flex-column">
        <Nav.Link
          as={Link}
          to="/"
          active={currentPath === '/'}
          style={{ color: '#fff' }}
        >
          Home
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/add-funds"
          active={currentPath === '/add-funds'}
          style={{ color: '#fff' }}
        >
          Add Funds
        </Nav.Link>
        {/* Add more navigation links as needed */}
      </Nav>
    </div>
  );
};

export default Sidebar;
