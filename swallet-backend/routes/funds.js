// routes/funds.js

const express = require('express');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/add-from-card', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentMethodId, amount } = req.body;

    if (!paymentMethodId || !amount) {
      console.error('Missing paymentMethodId or amount');
      return res.status(400).json({ message: 'Missing payment method or amount.' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error('Invalid amount:', amount);
      return res.status(400).json({ message: 'Invalid amount.' });
    }

    const amountInCents = Math.round(parsedAmount * 100);

    console.log('Creating payment intent with:', {
      amountInCents,
      paymentMethodId
    });

    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        payment_method: paymentMethodId,
        payment_method_types: ['card'], // Only allow card, no redirect required
        confirmation_method: 'manual',
        confirm: true,
      });
    } catch (stripeError) {
      console.error('Error creating or confirming PaymentIntent:', stripeError);
      return res.status(500).json({ message: 'Error creating payment intent', error: stripeError.message });
    }

    console.log('PaymentIntent status:', paymentIntent.status);

    if (paymentIntent.status !== 'succeeded') {
      console.error('Payment not succeeded, status:', paymentIntent.status);
      return res.status(402).json({ message: 'Payment not succeeded.', intentStatus: paymentIntent.status });
    }

    // Payment succeeded, update wallet balance
    const walletResult = await pool.query('SELECT balance FROM wallets WHERE user_id = $1', [userId]);
    let currentBalance = 0.00;
    if (walletResult.rows.length > 0) {
      currentBalance = parseFloat(walletResult.rows[0].balance);
    } else {
      await pool.query('INSERT INTO wallets (user_id, balance) VALUES ($1, $2)', [userId, 0.00]);
    }

    const newBalance = currentBalance + parsedAmount;
    await pool.query('UPDATE wallets SET balance = $1 WHERE user_id = $2', [newBalance, userId]);

    console.log('Funds added successfully. New balance:', newBalance);
    res.json({ message: 'Funds added successfully.', newBalance });
  } catch (error) {
    console.error('Error adding funds with Stripe:', error);
    res.status(500).json({ message: 'Server error during payment.', error: error.message });
  }
});

module.exports = router;
