
const pool = require('../config/database');

class Answer {
  static async create(sessionId, questionId, userAnswer, isCorrect, pointsEarned) {
    const query = `
      INSERT INTO answers (session_id, question_id, user_answer, is_correct, points_earned)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [
      sessionId,
      questionId,
      userAnswer,
      isCorrect,
      pointsEarned,
    ]);
    return result.rows[0];
  }

  static async findBySession(sessionId) {
    const query = `
      SELECT * FROM answers
      WHERE session_id = $1
      ORDER BY submitted_at ASC
    `;
    const result = await pool.query(query, [sessionId]);
    return result.rows;
  }
}

module.exports = Answer;
