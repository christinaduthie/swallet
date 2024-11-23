const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');

// Route to get users
router.get('/', getUsers);

module.exports = router;
