const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

// Open database
let db;

const initializeDatabase = async () => {
  try {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    // Create users table for authentication
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create projects table with user_id foreign key
    await db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
        estimated_time TEXT,
        description TEXT,
        progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
        is_demo BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
      )
    `);

    // Create steps table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        -- Temporarily disable foreign key for debugging
        -- FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
      )
    `);

    // Create step_media table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS step_media (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        step_id INTEGER,
        media_type TEXT NOT NULL,
        media_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (step_id) REFERENCES steps (id) ON DELETE CASCADE
      )
    `);

    // Create IoT devices table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS iot_devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        type TEXT,
        location TEXT,
        status TEXT DEFAULT 'offline',
        last_seen DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sensor data table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS sensor_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id TEXT NOT NULL,
        temperature REAL,
        humidity REAL,
        pressure REAL,
        light_level REAL,
        motion_detected BOOLEAN DEFAULT FALSE,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (device_id) REFERENCES iot_devices (device_id) ON DELETE CASCADE
      )
    `);

    // Create sensor data aggregation table for performance
    await db.exec(`
      CREATE TABLE IF NOT EXISTS sensor_data_hourly (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id TEXT NOT NULL,
        hour_start DATETIME NOT NULL,
        avg_temperature REAL,
        avg_humidity REAL,
        avg_pressure REAL,
        avg_light_level REAL,
        motion_count INTEGER DEFAULT 0,
        data_points INTEGER DEFAULT 0,
        FOREIGN KEY (device_id) REFERENCES iot_devices (device_id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_sensor_data_device_timestamp 
      ON sensor_data(device_id, timestamp DESC)
    `);

    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_sensor_data_hourly_device_hour 
      ON sensor_data_hourly(device_id, hour_start DESC)
    `);

    console.log('SQLite database initialized successfully');
    // Add missing columns to steps table if they don't exist (upgrade path)
    const cols = await db.all(`PRAGMA table_info(steps);`);
    const colNames = cols.map(c => c.name);
    if (!colNames.includes('components')) {
      await db.exec(`ALTER TABLE steps ADD COLUMN components TEXT;`);
    }
    if (!colNames.includes('connections')) {
      await db.exec(`ALTER TABLE steps ADD COLUMN connections TEXT;`);
    }
    if (!colNames.includes('working')) {
      await db.exec(`ALTER TABLE steps ADD COLUMN working TEXT;`);
    }
    if (!colNames.includes('instructions')) {
      await db.exec(`ALTER TABLE steps ADD COLUMN instructions TEXT;`);
    }
    if (!colNames.includes('conclusion')) {
      await db.exec(`ALTER TABLE steps ADD COLUMN conclusion TEXT;`);
    }
    if (!colNames.includes('step_number')) {
      await db.exec(`ALTER TABLE steps ADD COLUMN step_number INTEGER;`);
    }
    if (!colNames.includes('detailed_content')) {
      await db.exec(`ALTER TABLE steps ADD COLUMN detailed_content TEXT;`);
    }
    if (!colNames.includes('code')) {
      await db.exec(`ALTER TABLE steps ADD COLUMN code TEXT;`);
    }
  } catch (error) {
    console.error('Error initializing SQLite database:', error);
    throw error;
  }
};

// Helper function for database queries
const query = async (sql, params = []) => {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }

    // Convert PostgreSQL-specific functions to SQLite equivalents
    let convertedSql = sql
      // Replace PostgreSQL JSON functions with placeholders for SQLite
      .replace(/json_agg\([^)]*FILTER \(WHERE [^)]*IS NOT NULL\)\)/g, "'[]'")
      .replace(/json_build_object\([^)]*\)/g, "'{}'")
      // Replace PostgreSQL-specific syntax
      .replace(/COUNT\(CASE WHEN ([^)]+) THEN 1 END\)/g, "SUM(CASE WHEN $1 THEN 1 ELSE 0 END)");

    let result;
    if (convertedSql.trim().toUpperCase().startsWith('SELECT')) {
      result = await db.all(convertedSql, params);
      
      // Process results to match PostgreSQL behavior
      if (sql.includes('json_agg') && sql.includes('FILTER')) {
        // For the specific case in getAllProjects, we need to manually populate steps and media
        if (sql.includes('LEFT JOIN steps')) {
          const projects = result;
          
          // Get steps for each project
          for (let project of projects) {
            const stepsResult = await db.all(
              `SELECT * FROM steps WHERE project_id = ? ORDER BY created_at ASC`, 
              [project.id]
            );
            
            // For each step, get its media
            const stepsWithMedia = [];
            for (let step of stepsResult) {
              const mediaResult = await db.all(
                `SELECT * FROM step_media WHERE step_id = ?`, 
                [step.id]
              );
              
              stepsWithMedia.push({
                ...step,
                media: mediaResult || []
              });
            }
            
            // Calculate totals
            const totalSteps = stepsWithMedia.length;
            const completedSteps = stepsWithMedia.filter(s => s.status === 'completed').length;
            project.total_steps = totalSteps.toString();
            project.completed_steps = completedSteps.toString();
            project.progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
          }
          
          return { rows: projects };
        }
      }
    } else if (convertedSql.trim().toUpperCase().startsWith('UPDATE')) {
      // For UPDATE with RETURNING, we need to run the update then select the row
      // Execute the UPDATE without RETURNING
      const updateSql = convertedSql.replace(/\s+RETURNING\s+\*/i, '');
      const result = await db.run(updateSql, params);
      
      console.log('UPDATE result:', result);
      
      // Extract the WHERE condition to get the ID
      const whereMatch = convertedSql.match(/WHERE\s+id\s*=\s*\?(?:\s+|$)/i);
      if (whereMatch && params.length > 0) {
        const id = params[params.length - 1]; // Last param should be the ID
        
        // Determine table name from SQL
        let tableName = '';
        if (convertedSql.toLowerCase().includes('update steps')) {
          tableName = 'steps';
        } else if (convertedSql.toLowerCase().includes('update projects')) {
          tableName = 'projects';
        } else if (convertedSql.toLowerCase().includes('update users')) {
          tableName = 'users';
        } else if (convertedSql.toLowerCase().includes('update step_media')) {
          tableName = 'step_media';
        }
        
        if (tableName) {
          const updatedRow = await db.get(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
          console.log('Selected row after update:', updatedRow);
          return { rows: [updatedRow] };
        }
      }
      
      // Fallback - return empty result
      return { rows: [] };
    } else if (convertedSql.trim().toUpperCase().startsWith('INSERT')) {
      result = await db.run(convertedSql, params);
      
      // For INSERT, return the newly inserted row with the auto-generated ID
      // The SQLite driver returns lastID directly
      const insertedId = result.lastID;
      
      // Also include lastID in the returned object for backward compatibility
      const returnResult = { rows: [{ id: insertedId }], lastID: insertedId };
      
      // For users table, get the inserted user data
      if (convertedSql.toLowerCase().includes('insert into users')) {
        const newRow = await db.get('SELECT * FROM users WHERE id = ?', [insertedId]);
        return { rows: [newRow] };
      } 
      // For projects table, get the inserted project data
      else if (convertedSql.toLowerCase().includes('insert into projects')) {
        const newRow = await db.get('SELECT * FROM projects WHERE id = ?', [insertedId]);
        return { rows: [newRow], lastID: insertedId };
      } 
      // For steps table, get the inserted step data
      else if (convertedSql.toLowerCase().includes('insert into steps')) {
        const newRow = await db.get('SELECT * FROM steps WHERE id = ?', [insertedId]);
        return { rows: [newRow], lastID: insertedId };
      } 
      // For step_media table, get the inserted media data
      else if (convertedSql.toLowerCase().includes('insert into step_media')) {
        const newRow = await db.get('SELECT * FROM step_media WHERE id = ?', [insertedId]);
        return { rows: [newRow], lastID: insertedId };
      } 
      else {
        return { rows: [{ id: insertedId }], lastID: insertedId };
      }
    } else {
      result = await db.run(convertedSql, params);
    }
    
    return { rows: Array.isArray(result) ? result : [result] };
  } catch (error) {
    console.error('Database query error:', error);
    // Log the problematic SQL for debugging
    console.error('Problematic SQL:', sql);
    throw error;
  }
};

module.exports = {
  query,
  initializeDatabase
};