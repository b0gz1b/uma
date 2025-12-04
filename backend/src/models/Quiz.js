const pool = require('../config/database');

class Quiz {
  static async create(createdBy, metadata, settings) {
    const query = `
      INSERT INTO quizzes (created_by, metadata, settings)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [createdBy, metadata, settings]);
    return result.rows[0];
  }

  static async findAll(published = true) {
    const query = `
      SELECT id, metadata, settings, created_at, updated_at
      FROM quizzes
      WHERE published = $1
      ORDER BY updated_at DESC
    `;
    const result = await pool.query(query, [published]);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT q.*, json_agg(
        json_build_object(
          'id', qst.id,
          'order', qst."order",
          'title', qst.title,
          'difficulty', qst.difficulty,
          'timeLimit', qst.time_limit,
          'correctAnswer', qst.correct_answer,
          'acceptableAnswers', qst.acceptable_answers,
          'explanation', qst.explanation,
          'questionSegments', (
            SELECT json_agg(
              json_build_object(
                'id', s.id,
                'type', s.type,
                'duration', s.duration,
                'points', s.points,
                'contentUrl', s.content_url,
                'order', s."order"
              )
              ORDER BY s."order"
            )
            FROM segments s
            WHERE s.question_id = qst.id
          )
        )
        ORDER BY qst."order"
      ) as questions
      FROM quizzes q
      LEFT JOIN questions qst ON q.id = qst.quiz_id
      WHERE q.id = $1
      GROUP BY q.id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async update(id, metadata, settings) {
    const query = `
      UPDATE quizzes
      SET metadata = $1, settings = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [metadata, settings, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM quizzes WHERE id = $1';
    await pool.query(query, [id]);
  }

  static async publish(id) {
    const query = `
      UPDATE quizzes
      SET published = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Quiz;

