// import React, { useContext } from 'react';
// import { AuthContext } from '../contexts/AuthContext';
// import { Navbar, Nav, Container, Dropdown, Image } from 'react-bootstrap';
// import { useNavigate, Link, useLocation } from 'react-router-dom';

// const NavBar = () => {
//   const { authToken, logout, user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const currentPath = location.pathname;

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const handleViewProfile = () => {
//     navigate('/my-account');
//   };

//   return (
//     <Navbar collapseOnSelect expand="lg" className="navbar" variant="dark">
//       <Container fluid>
//         <Navbar.Brand as={Link} to="/">
          
//         </Navbar.Brand>
//         {authToken && (
//           <>
//             <Navbar.Toggle aria-controls="responsive-navbar-nav" />
//             <Navbar.Collapse id="responsive-navbar-nav">
//               <Nav className="me-auto">
//                 <Nav.Link as={Link} to="/" active={currentPath === '/'}>
//                   Home
//                 </Nav.Link>
//                 <Nav.Link as={Link} to="/add-funds" active={currentPath === '/add-funds'}>
//                   Add Funds
//                 </Nav.Link>
//                 {/* Add more navigation links as needed */}
//               </Nav>
//               <Nav className="ms-auto align-items-center">
//                 <Dropdown align="end" as={Nav.Item}>
//                   <Dropdown.Toggle
//                     as={Nav.Link}
//                     id="dropdown-profile"
//                     className="d-flex align-items-center"
//                   >
//                     <Image
//                       src={user?.profile_icon || '/assets/images/default-profile.png'}
//                       roundedCircle
//                       width="30"
//                       height="30"
//                       className="me-2"
//                     />
//                     {user?.name}
//                   </Dropdown.Toggle>

//                   <Dropdown.Menu>
//                     <Dropdown.Item onClick={handleViewProfile}>
//                       View Profile
//                     </Dropdown.Item>
//                     <Dropdown.Divider />
//                     <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </Nav>
//             </Navbar.Collapse>
//           </>
//         )}
//       </Container>
//     </Navbar>
//   );
// };

// export default NavBar;
