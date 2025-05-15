/**
 * Chat API routes for RAG functionality
 */

const express = require('express');
const router = express.Router();
const ragChatService = require('../services/ragChatService');

/**
 * POST /api/chat/completion
 * Chat completion endpoint with RAG capabilities
 */
router.post('/completion', async (req, res, next) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages must be provided as an array' });
    }
    
    const completion = await ragChatService.getChatCompletion(messages);
    res.json(completion);
  } catch (error) {
    // Handle rate limit errors in the route rather than passing to global error handler
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      return res.status(200).json({
        choices: [{
          message: {
            role: 'assistant',
            content: "The AI service is currently experiencing high demand. Please wait a moment and try again."
          }
        }]
      });
    }
    
    // Pass other errors to global handler
    next(error);
  }
});

module.exports = router;
