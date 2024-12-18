import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

const MyAccountPage = () => {
  const { authToken, user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [message, setMessage] = useState('');
  const [profileIcon, setProfileIcon] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
      });
      setProfileIcon(user.profile_icon || '');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileIconChange = (e) => {
    // Handle file upload
    const file = e.target.files[0];
    if (file) {
      // Convert file to base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileIcon(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${API_URL}/api/auth/user`,
        { ...formData, profile_icon: profileIcon },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setMessage(response.data.message);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(
        error.response?.data?.message || 'An error occurred while updating your profile.'
      );
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${API_URL}/api/auth/change-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setMessage(response.data.message);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage(
        error.response?.data?.message || 'An error occurred while changing your password.'
      );
    }
  };

  return (
   <div className='main-content'> <Container>
   <h2>My Account</h2>
   {message && <Alert variant="info">{message}</Alert>}
   <Card className="mb-4">
     <Card.Body>
       <Form onSubmit={handleUpdateProfile}>
         {/* Display Wallet ID */}
         <Form.Group controlId="formWalletId" className="mb-3">
           <Form.Label>Wallet ID</Form.Label>
           <Form.Control type="text" value={user?.wallet_id} disabled />
         </Form.Group>
         {/* Other form fields */}
         <Form.Group controlId="formName" className="mb-3">
           <Form.Label>Name</Form.Label>
           <Form.Control
             type="text"
             name="name"
             value={formData.name}
             onChange={handleChange}
           />
         </Form.Group>
         <Form.Group controlId="formPhone" className="mb-3">
           <Form.Label>Phone</Form.Label>
           <Form.Control
             type="tel"
             name="phone"
             value={formData.phone}
             onChange={handleChange}
           />
         </Form.Group>
         <Form.Group controlId="formProfileIcon" className="mb-3">
           <Form.Label>Profile Icon</Form.Label>
           <Form.Control type="file" onChange={handleProfileIconChange} />
           {profileIcon && (
             <img src={profileIcon} alt="Profile Icon" width="100" className="mt-2" />
           )}
         </Form.Group>
         <Button variant="primary" type="submit">
           Update Profile
         </Button>
       </Form>
     </Card.Body>
   </Card>

   <h3>Change Password</h3>
   <Card>
     <Card.Body>
       <Form onSubmit={handlePasswordChange}>
         <Form.Group controlId="formCurrentPassword" className="mb-3">
           <Form.Label>Current Password</Form.Label>
           <Form.Control
             type="password"
             name="currentPassword"
             value={passwordData.currentPassword}
             onChange={(e) =>
               setPasswordData({ ...passwordData, currentPassword: e.target.value })
             }
             required
           />
         </Form.Group>
         <Form.Group controlId="formNewPassword" className="mb-3">
           <Form.Label>New Password</Form.Label>
           <Form.Control
             type="password"
             name="newPassword"
             value={passwordData.newPassword}
             onChange={(e) =>
               setPasswordData({ ...passwordData, newPassword: e.target.value })
             }
             required
           />
         </Form.Group>
         <Button variant="primary" type="submit">
           Change Password
         </Button>
       </Form>
     </Card.Body>
   </Card>
 </Container></div>
  );
};

export default MyAccountPage;
