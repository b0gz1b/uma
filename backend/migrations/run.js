const fs = require('fs');
const path = require('path');
const pool = require('../src/config/database');

async function runMigrations() {
  try {
    const sqlFile = fs.readFileSync(
      path.join(__dirname, '01_create_tables.sql'),
      'utf8'
    );

    await pool.query(sqlFile);
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigrations();
