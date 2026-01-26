const { Pool } = require('pg');
require('dotenv').config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') 
    ? { rejectUnauthorized: false } 
    : undefined
});

const addUserIdColumn = async () => {
  try {
    console.log('Adding user_id column to projects table...');
    
    // Add user_id column to projects table
    await pool.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS user_id UUID 
      REFERENCES users(id) ON DELETE SET NULL;
    `);
    
    console.log('Successfully added user_id column to projects table');
    
    // Verify the column exists
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'user_id';
    `);
    
    console.log('Column verification:', result.rows);
    
    await pool.end();
    console.log('Done!');
  } catch (error) {
    console.error('Error adding column:', error);
    await pool.end();
  }
};

addUserIdColumn();