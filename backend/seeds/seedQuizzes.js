const fs = require("fs");
const path = require("path");
const pool = require("../src/config/database");

async function seed() {
  try {
    console.log("🔍 Checking for admin user...");

    // Check if admin user exists, create if not
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      ["admin@quizmaster.com"],
    );

    let adminUserId;
    if (userCheck.rows.length === 0) {
      console.log("👤 Creating admin user...");
      const userResult = await pool.query(
        `INSERT INTO users (email, password_hash) 
         VALUES ($1, $2) RETURNING id`,
        ["admin@quizmaster.com", "$2b$10$dummyhashforseedingonly"],
      );
      adminUserId = userResult.rows[0].id;
    } else {
      adminUserId = userCheck.rows[0].id;
      console.log(`✅ Admin user found: ID ${adminUserId}`);
    }

    // Check if sample quiz data exists
    const filePath = path.join(__dirname, "../data/sample-quiz.json");
    if (!fs.existsSync(filePath)) {
      console.error("❌ sample-quiz.json not found at:", filePath);
      console.log(
        "📝 Please copy your existing quiz JSON to backend/data/sample-quiz.json",
      );
      process.exit(1);
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    const quizzes = JSON.parse(rawData);
    const quizzesArray = Array.isArray(quizzes) ? quizzes : [quizzes];

    console.log(`🌟 Seeding ${quizzesArray.length} quiz(s)...`);

    for (let i = 0; i < quizzesArray.length; i++) {
      const quizData = quizzesArray[i];

      // Extract metadata from the quiz data
      const metadata = {
        id: quizData.metadata?.id || quizData.id,
        title: quizData.metadata?.title || quizData.title || `Quiz ${i + 1}`,
        author: quizData.metadata?.author || quizData.author || "Quiz Master",
        category: quizData.metadata?.category || quizData.category || "General",
        difficulty:
          quizData.metadata?.difficulty || quizData.difficulty || "medium",
        description:
          quizData.metadata?.description ||
          quizData.description ||
          "Sample quiz data",
        nb_questions: quizData.metadata?.nb_questions || 0,
      };

      console.log(`📚 Processing quiz: ${metadata.title}`);

      const settings = {
        defaultQuestionDuration:
          quizData.settings?.defaultQuestionDuration || 30,
        minParticipants: quizData.settings?.minParticipants || 1,
        maxParticipants: quizData.settings?.maxParticipants || 10,
        requiresApproval: quizData.settings?.requiresApproval || false,
        allowRevisions: quizData.settings?.allowRevisions || false,
      };

      // Insert quiz
      const quizResult = await pool.query(
        `INSERT INTO quizzes (created_by, published, metadata, settings)
         VALUES ($1, $2, $3, $4)
         RETURNING id, metadata`,
        [adminUserId, true, metadata, settings],
      );

      const quizId = quizResult.rows[0].id;
      console.log(`✅ Quiz created: ID ${quizId} (${metadata.title})`);

      // Insert questions
      let questionOrder = 1;
      const questions = quizData.questions || [];

      for (const question of questions) {
        const acceptableAnswers = question.acceptableAnswers || [
          question.correctAnswer || "",
        ];
        const correctAnswer =
          question.correctAnswer || acceptableAnswers[0] || "";

        const questionResult = await pool.query(
          `INSERT INTO questions 
            (quiz_id, "order", title, difficulty, time_limit, correct_answer, acceptable_answers, explanation)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id`,
          [
            quizId,
            questionOrder++,
            question.title || "Untitled Question",
            question.difficulty || "medium",
            question.timeLimit || 30,
            correctAnswer,
            JSON.stringify(acceptableAnswers),
            question.explanation || null,
          ],
        );

        const questionId = questionResult.rows[0].id;

        // Insert segments
        const segments = question.questionSegments || [];
        let segmentOrder = 1;

        for (const segment of segments) {
          await pool.query(
            `INSERT INTO segments 
              (question_id, type, duration, points, content_url, "order")
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              questionId,
              segment.type || "text",
              segment.duration || null,
              segment.points || 10,
              segment.contentUrl || null,
              segmentOrder++,
            ],
          );
        }
      }
    }

    console.log("🎉 Seeding completed successfully!");

    // Show summary
    const quizzesResult = await pool.query(
      "SELECT id, metadata->>'title' as title FROM quizzes WHERE published = true",
    );
    console.log("\n📋 Published Quizzes:");
    quizzesResult.rows.forEach((q) =>
      console.log(`  - ${q.title} (DB ID: ${q.id})`),
    );

    process.exit(0);
  } catch (err) {
    console.error("❌ Error during seeding:", err.message);
    process.exit(1);
  }
}

seed();
