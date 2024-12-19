const pool = require('../config/db');

// weights
const Wf = 0.3;
const Wa = 0.3;
const Wb = 0.4;

async function recalculateScore(userId) {
  // Transaction Frequency last 30 days
  const freqRes = await pool.query(`
    SELECT COUNT(*) as total,
           SUM(CASE WHEN type='credit' THEN 1 ELSE 0 END) as credits,
           SUM(CASE WHEN type='debit' THEN 1 ELSE 0 END) as debits
    FROM transactions
    WHERE user_id=$1 AND created_at > (NOW() - INTERVAL '30 days')
  `, [userId]);

  const total = parseInt(freqRes.rows[0].total, 10) || 0;
  const credits = parseInt(freqRes.rows[0].credits, 10) || 0;
  const debits = parseInt(freqRes.rows[0].debits, 10) || 0;

  let Tf = 0;
  // Max Tf=100 if at least 3 transactions (1 credit & 2 debits)
  if (credits >= 1 && debits >= 2 && total >= 3) {
    Tf = 100;
  } else {
    // partial credit if not meeting fully
    // For simplicity, give partial scores
    const minReq = 3;
    Tf = (total / minReq) * 50;
    if (Tf > 50) Tf = 50;
  }

  // Transaction Amount (Ta)
  const amtRes = await pool.query(`
    SELECT AVG(amount) as avg_amount
    FROM transactions
    WHERE user_id=$1 AND created_at > (NOW() - INTERVAL '30 days')
  `, [userId]);

  const avgAmt = parseFloat(amtRes.rows[0].avg_amount) || 0;
  // If avgAmt > 100 => Ta=100 else scale proportionally
  let Ta = (avgAmt > 100) ? 100 : (avgAmt / 100) * 100;
  if (Ta > 100) Ta = 100;

  // Repayment Behavior (Rb) assume perfect = 100
  let Rb = 100;

  const score = (Tf * Wf) + (Ta * Wa) + (Rb * Wb);

  await pool.query(`
    INSERT INTO scores (user_id, score, calculated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (user_id) DO UPDATE SET score=EXCLUDED.score, calculated_at=EXCLUDED.calculated_at
  `, [userId, Math.round(score)]);

  return Math.round(score);
}

async function getScoreAndEligibility(userId) {
  const sRes = await pool.query(`SELECT score FROM scores WHERE user_id=$1 LIMIT 1`, [userId]);
  console.log('getScoreAndEligibility for userId=', userId, 'rows=', sRes.rows);

  if (sRes.rows.length === 0) {
    return {score:0, eligibility:0};
  }
  const score = sRes.rows[0].score;

  let loanAmount = 0;
  if (score < 20) loanAmount = 0;
  else if (score <= 40) loanAmount = 100;
  else if (score <= 60) loanAmount = 200;
  else if (score <= 80) loanAmount = 500;
  else loanAmount = 2000;

  return {score, eligibility: loanAmount};
}

module.exports = { recalculateScore, getScoreAndEligibility };
