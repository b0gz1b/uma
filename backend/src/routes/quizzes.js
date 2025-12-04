
const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// Get all published quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.findAll(true);
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get single quiz with questions
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Create quiz (admin only - implement auth later)
router.post('/', async (req, res) => {
  try {
    const { metadata, settings } = req.body;
    const createdBy = 1; // TODO: get from auth token
    
    const quiz = await Quiz.create(createdBy, metadata, settings);
    res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Update quiz
router.put('/:id', async (req, res) => {
  try {
    const { metadata, settings } = req.body;
    const quiz = await Quiz.update(req.params.id, metadata, settings);
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

// Delete quiz
router.delete('/:id', async (req, res) => {
  try {
    await Quiz.delete(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// Publish quiz
router.post('/:id/publish', async (req, res) => {
  try {
    const quiz = await Quiz.publish(req.params.id);
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to publish quiz' });
  }
});

module.exports = router;
