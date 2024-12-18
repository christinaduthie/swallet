// routes/checkDeposits.js

const express = require('express');
const pool = require('../config/db');       
const clientDbPool = require('../config/clientDb');
const authenticateToken = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

async function performOCRWithOcrSpace(base64Image) {
  const apiKey = process.env.OCR_SPACE_API_KEY;
  if (!apiKey) {
    throw new Error('OCR_SPACE_API_KEY not set in .env');
  }

  const formData = new URLSearchParams();
  formData.append('apikey', apiKey);
  formData.append('base64Image', `data:image/png;base64,${base64Image}`);
  formData.append('language', 'eng');

  const response = await axios.post('https://api.ocr.space/parse/image', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  const ocrResult = response.data;
  if (ocrResult.IsErroredOnProcessing) {
    throw new Error(`OCR Error: ${ocrResult.ErrorMessage}`);
  }

  const parsedText = ocrResult.ParsedResults?.[0]?.ParsedText || '';
  console.log('Backend: Raw OCR Extracted Text:', parsedText); // Log the text in backend console
  return parsedText;
}

router.post('/ocr-only', authenticateToken, async (req, res) => {
  try {
    const { frontImage, backImage } = req.body;

    if (!frontImage || !backImage) {
      return res.status(400).json({ message: 'Both front and back images are required.' });
    }

    const extractedText = await performOCRWithOcrSpace(frontImage);
    // Log if extractedText is empty or not
    console.log('Backend: extractedText length:', extractedText.length);

    res.json({
      message: 'OCR successful. Below is the raw extracted text.',
      rawText: extractedText
    });

  } catch (error) {
    console.error('Error during OCR process:', error);
    res.status(500).json({ 
      message: 'Error during OCR process.', 
      error: error.message 
    });
  }
});

module.exports = router;
