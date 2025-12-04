const pool = require("../src/config/database");

async function flushDatabase() {
  try {
    console.log("🗑️  Flushing database...");

    // Drop all tables in correct order (respect foreign keys)
    await pool.query("DROP TABLE IF EXISTS answers CASCADE");
    await pool.query("DROP TABLE IF EXISTS segments CASCADE");
    await pool.query("DROP TABLE IF EXISTS questions CASCADE");
    await pool.query("DROP TABLE IF EXISTS sessions CASCADE");
    await pool.query("DROP TABLE IF EXISTS quizzes CASCADE");
    await pool.query("DROP TABLE IF EXISTS users CASCADE");

    console.log("✅ All tables dropped successfully");

    // Run migrations to recreate tables
    console.log("🔄 Recreating tables...");
    const fs = require("fs");
    const path = require("path");

    const sqlFile = fs.readFileSync(
      path.join(__dirname, "../migrations/01_create_tables.sql"),
      "utf8",
    );

    await pool.query(sqlFile);
    console.log("✅ Tables recreated successfully");
    console.log("🎉 Database flush complete!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error flushing database:", err.message);
    process.exit(1);
  }
}

flushDatabase();
