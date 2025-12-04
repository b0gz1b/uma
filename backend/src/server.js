const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/database');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Database connection test
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'Connected to PostgreSQL',
      time: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Database connection failed',
      message: err.message 
    });
  }
});

// Routes will be added here
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/sessions', require('./routes/sessions'));
// app.use('/api/answers', require('./routes/answers'));
// app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
