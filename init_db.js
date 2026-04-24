import { query } from './db.js';
import fs from 'fs';
import path from 'path';

const sqlFile = path.resolve('donation_system.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

async function init() {
  try {
    console.log("Connecting to database...");
    // Test connection
    await query('SELECT NOW()');
    console.log("Connection successful! Initializing database...");
    
    // Split SQL by semicolon and filter out empty strings (basic split, not perfect for triggers/functions)
    // But for this project's SQL, it should be fine.
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (let statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await query(statement + ';');
    }

    console.log("Database initialized successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Initialization failed:", err);
    process.exit(1);
  }
}

init();
