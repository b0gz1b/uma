
const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Answer = require('../models/Answer');

// Start quiz session
router.post('/', async (req, res) => {
  try {
    const { quizId, participantName } = req.body;
    const session = await Session.create(quizId, participantName);
    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get session
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Complete session
router.put('/:id/complete', async (req, res) => {
  try {
    const { totalScore } = req.body;
    const session = await Session.complete(req.params.id, totalScore);
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to complete session' });
  }
});

// Get session results
router.get('/:id/results', async (req, res) => {
  try {
    const results = await Session.getResults(req.params.id);
    if (!results) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Submit answer
router.post('/:id/answers', async (req, res) => {
  try {
    const { questionId, userAnswer, isCorrect, pointsEarned } = req.body;
    const answer = await Answer.create(
      req.params.id,
      questionId,
      userAnswer,
      isCorrect,
      pointsEarned
    );
    res.status(201).json(answer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

module.exports = router;
