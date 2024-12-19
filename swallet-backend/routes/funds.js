
const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { recalculateScore } = require('../services/scoring'); 

const router = express.Router();

async function insertTransaction(userId, amount, description, mode) {
  const balanceResult = await pool.query('SELECT balance FROM wallets WHERE user_id = $1', [userId]);
  let currentBalance = 0.00;
  if (balanceResult.rows.length > 0) {
    currentBalance = parseFloat(balanceResult.rows[0].balance);
  }
  
  await pool.query(
    'INSERT INTO transactions (user_id, amount, description, type, mode, running_balance) VALUES ($1, $2, $3, $4, $5, $6)',
    [userId, amount, description, 'transfer', mode, currentBalance]
  );

  await recalculateScore(userId);
}

router.post('/add-from-card', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentMethodId, amount } = req.body;

    if (!paymentMethodId || !amount) {
      return res.status(400).json({ message: 'Missing payment method or amount.' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount.' });
    }

    const amountInCents = Math.round(parsedAmount * 100);

    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        payment_method: paymentMethodId,
        payment_method_types: ['card'],
        confirmation_method: 'manual',
        confirm: true,
      });
    } catch (stripeError) {
      return res.status(500).json({ message: 'Error creating payment intent', error: stripeError.message });
    }

    if (paymentIntent.status !== 'succeeded') {
      return res.status(402).json({ message: 'Payment not succeeded.', intentStatus: paymentIntent.status });
    }

    const walletResult = await pool.query('SELECT balance FROM wallets WHERE user_id = $1', [userId]);
    let currentBalance = 0.00;
    if (walletResult.rows.length > 0) {
      currentBalance = parseFloat(walletResult.rows[0].balance);
    } else {
      await pool.query('INSERT INTO wallets (user_id, balance) VALUES ($1, $2)', [userId, 0.00]);
    }

    const newBalance = currentBalance + parsedAmount;
    await pool.query('UPDATE wallets SET balance = $1 WHERE user_id = $2', [newBalance, userId]);

    await insertTransaction(userId, parsedAmount, 'Added funds from card', 'Credit');

    res.json({ message: 'Funds added successfully.', newBalance });
  } catch (error) {
    console.error('Error adding funds with Stripe:', error);
    res.status(500).json({ message: 'Server error during payment.', error: error.message });
  }
});

// Transfer funds
router.post('/transfer', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { recipientSwalletId, amount } = req.body;

    if (!recipientSwalletId || !amount) {
      return res.status(400).json({ message: 'Recipient and amount are required.' });
    }

    const recipientUser = await pool.query('SELECT id FROM users WHERE wallet_id = $1', [recipientSwalletId]);
    if (recipientUser.rows.length === 0) {
      return res.status(404).json({ message: 'Recipient not found.' });
    }
    const recipientId = recipientUser.rows[0].id;

    const senderResult = await pool.query('SELECT balance FROM wallets WHERE user_id = $1', [userId]);
    if (senderResult.rows.length === 0) {
      return res.status(400).json({ message: 'Sender wallet not found.' });
    }

    const senderBalance = parseFloat(senderResult.rows[0].balance);
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount.' });
    }
    if (senderBalance < transferAmount) {
      return res.status(400).json({ message: 'Insufficient funds.' });
    }

    const newSenderBalance = senderBalance - transferAmount;
    await pool.query('UPDATE wallets SET balance = $1 WHERE user_id = $2', [newSenderBalance, userId]);

    await insertTransaction(userId, -transferAmount, `Transfer to ${recipientSwalletId}`, 'Debit');

    const recipientResult = await pool.query('SELECT balance FROM wallets WHERE user_id = $1', [recipientId]);
    let recipientBalance = 0.00;
    if (recipientResult.rows.length > 0) {
      recipientBalance = parseFloat(recipientResult.rows[0].balance);
    } else {
      await pool.query('INSERT INTO wallets (user_id, balance) VALUES ($1, $2)', [recipientId, 0.00]);
    }

    const newRecipientBalance = recipientBalance + transferAmount;
    await pool.query('UPDATE wallets SET balance = $1 WHERE user_id = $2', [newRecipientBalance, recipientId]);

    await insertTransaction(recipientId, transferAmount, `Transfer from userId ${userId}`, 'Credit');

    return res.json({ message: 'Transfer successful.' });
  } catch (error) {
    console.error('Error during transfer:', error);
    res.status(500).json({ message: 'Server error during transfer.' });
  }
});

module.exports = router;

