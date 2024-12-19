const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
});

module.exports = router;
