const express = require('express');
const { answerUserQuery } = require('../rag/ragEngine');

const router = express.Router();

/**
 * POST /api/chat
 * Body: { message: string, history?: Array<{ sender: 'user' | 'assistant', content: string }> }
 */
router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const result = await answerUserQuery(message.trim(), history);
    res.json(result);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: 'Failed to process chat query', error: error.message });
  }
});

module.exports = router;
