// index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const bankAccountsRoutes = require('./routes/bankAccounts');
const fundsRoutes = require('./routes/funds');
const checkDepositsRoutes = require('./routes/checkDeposits');
const PORT = process.env.PORT || 5000;
const usersRoutes = require('./routes/users');
const loansRoutes = require('./routes/loans');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/bank-accounts', bankAccountsRoutes);
app.use('/api/funds', fundsRoutes);
app.use('/api/check-deposits', checkDepositsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/loans', loansRoutes);
// Test route
app.get('/', (req, res) => {
  res.send('Hello, Swallet Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
