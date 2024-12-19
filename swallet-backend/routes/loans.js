const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { getScoreAndEligibility } = require('../services/scoring');

router.get('/info', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching loan info for userId:', userId);

    const { score, eligibility } = await getScoreAndEligibility(userId);
    console.log(`Loan info for userId=${userId}: score=${score}, eligibility=${eligibility}`);

    res.json({ score, eligibility });
  } catch (error) {
    console.error('Error fetching loan info:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
