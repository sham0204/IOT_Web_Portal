const { Pool } = require('pg');
require('dotenv').config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') 
    ? { rejectUnauthorized: false } 
    : undefined
});

// Helper function for database queries
const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create extension for UUID generation if it doesn't exist
    await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    
    // Create users table for authentication
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure new columns exist (for upgrades)
    await query(`ALTER TABLE steps ADD COLUMN IF NOT EXISTS components TEXT;`);
    await query(`ALTER TABLE steps ADD COLUMN IF NOT EXISTS connections TEXT;`);
    await query(`ALTER TABLE steps ADD COLUMN IF NOT EXISTS working TEXT;`);
    await query(`ALTER TABLE steps ADD COLUMN IF NOT EXISTS instructions TEXT;`);
    await query(`ALTER TABLE steps ADD COLUMN IF NOT EXISTS conclusion TEXT;`);
    await query(`ALTER TABLE steps ADD COLUMN IF NOT EXISTS step_number INTEGER;`);
    await query(`ALTER TABLE steps ADD COLUMN IF NOT EXISTS detailed_content TEXT;`);
    await query(`ALTER TABLE steps ADD COLUMN IF NOT EXISTS code TEXT;`);
    
    // Create projects table
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        title TEXT NOT NULL,
        difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
        estimated_time TEXT,
        description TEXT,
        progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
        is_demo BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create steps table
    await query(`
      CREATE TABLE IF NOT EXISTS steps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        components TEXT,
        connections TEXT,
        working TEXT,
        instructions TEXT,
        code TEXT,
        conclusion TEXT,
        order_number INTEGER,
        step_number INTEGER,
        status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
        detailed_content TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create step_media table
    await query(`
      CREATE TABLE IF NOT EXISTS step_media (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        step_id UUID REFERENCES steps(id) ON DELETE CASCADE,
        media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
        media_url TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = {
  query,
  pool,
  initializeDatabase
};