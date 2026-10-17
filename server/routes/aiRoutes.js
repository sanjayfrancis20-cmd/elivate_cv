import express from 'express';
import { aiService } from '../services/aiService.js';

const router = express.Router();

// POST /api/ai/suggest
router.post('/suggest', async (req, res) => {
  try {
    const { type, currentText, targetRole, existingSkills, jobDescription, resumeData } = req.body;
    const customApiKey = req.headers['x-openai-key'] || req.body.customApiKey;

    if (!type) {
      return res.status(400).json({ success: false, message: 'Suggestion type is required' });
    }

    const result = await aiService.suggest({
      type,
      currentText,
      targetRole,
      existingSkills,
      jobDescription,
      resumeData,
      customApiKey
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('AI suggestion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process AI suggestion',
      error: error.message
    });
  }
});

export default router;
