
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';


import homeIcon from '../assets/images/homeIcon.svg';
import transactionsIcon from '../assets/images/transactionsIcon.svg';
import communityBankIcon from '../assets/images/communityBankIcon.svg';
import logoIcon from '../assets/images/logoIcon.svg';
import loanIcon from '../assets/images/loanIcon.svg';
import rewardsIcon from '../assets/images/rewardsIcon.svg';
import learnIcon from '../assets/images/learnIcon.svg';
import helpIcon from '../assets/images/helpIcon.svg';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    setExpanded(false);
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const closeSidebar = () => {
    setExpanded(false);
  };

  return (
    <>

      <Navbar
        expand="lg"
        variant="dark"
        className="d-lg-none sidebar-top-nav"
      >
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          Swallet
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="sidebar-navbar-nav" onClick={toggleSidebar} />
      </Navbar>

      {expanded && <div className="overlay" onClick={closeSidebar}></div>}

      <div className={`sidebar ${expanded ? 'active' : ''}`}>
        <Navbar.Brand as={Link} to="/" className="sidebar-logo navbar-brand">
          <img src={logoIcon} alt="Swallet Logo" style={{width:'40px',marginRight:'10px'}}/>
          <span style={{color:'#600FA0'}}>SWallet</span>
        </Navbar.Brand>
        <div className="tagline">Your Wallet, Your World </div>

        <Nav defaultActiveKey="/" className="flex-column">
          <Nav.Link
            as={Link}
            to="/"
            active={currentPath === '/'}
            onClick={closeSidebar}
          >
            <img src={homeIcon} alt="Home" style={{width:'20px',marginRight:'10px'}}/>
            Home
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/transactions"
            active={currentPath === '/transactions'}
            onClick={closeSidebar}
          >
            <img src={transactionsIcon} alt="Transactions" style={{width:'20px',marginRight:'10px'}}/>
            Transactions
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/community-banks"
            active={currentPath === '/community-banks'}
            onClick={closeSidebar}
          >
            <img src={communityBankIcon} alt="Community Banks" style={{width:'20px',marginRight:'10px'}}/>
            Community Banks
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/loans"
            active={currentPath === '/loans'}
            onClick={closeSidebar}
          >
            <img src={loanIcon} alt="Loans" style={{width:'20px',marginRight:'10px'}}/>
            Loans
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/rewards"
            active={currentPath === '/rewards'}
            onClick={closeSidebar}
          >
            <img src={rewardsIcon} alt="Rewards" style={{width:'20px',marginRight:'10px'}}/>
            Rewards
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/learn"
            active={currentPath === '/learn'}
            onClick={closeSidebar}
          >
            <img src={learnIcon} alt="Learn" style={{width:'20px',marginRight:'10px'}}/>
            Learn with SWallet
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/help-center"
            active={currentPath === '/help-center'}
            onClick={closeSidebar}
          >
            <img src={helpIcon} alt="Help Center" style={{width:'20px',marginRight:'10px'}}/>
            Help Center
          </Nav.Link>
        </Nav>

        <Button variant="danger" className="logout-button" onClick={handleLogout}>
          Logout
        </Button>

        <div className="sidebar-footer text-center mt-3" style={{fontSize: '10px', color: '#6c757d', marginTop:'40s0px'}}>
          <div>SWallet Payments v2.1</div>
          <div>Developed at Mango Labs</div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
