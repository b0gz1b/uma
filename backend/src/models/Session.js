const pool = require('../config/database');

class Session {
  static async create(quizId, participantName) {
    const query = `
      INSERT INTO sessions (quiz_id, participant_name)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [quizId, participantName]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM sessions WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async complete(id, totalScore) {
    const query = `
      UPDATE sessions
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP, total_score = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [totalScore, id]);
    return result.rows[0];
  }

  static async getResults(id) {
    const query = `
      SELECT 
        s.*,
        q.metadata,
        json_agg(
          json_build_object(
            'questionId', a.question_id,
            'userAnswer', a.user_answer,
            'isCorrect', a.is_correct,
            'pointsEarned', a.points_earned,
            'submittedAt', a.submitted_at
          )
        ) as answers
      FROM sessions s
      LEFT JOIN quizzes q ON s.quiz_id = q.id
      LEFT JOIN answers a ON s.id = a.session_id
      WHERE s.id = $1
      GROUP BY s.id, q.metadata
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}

module.exports = Session;

