const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../db-local'); // Use local database
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Username, email, and password are required' 
      });
    }
    
    // Validate role if provided
    const validRoles = ['user', 'admin'];
    const userRole = validRoles.includes(role) ? role : 'user';

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        error: 'User with this email or username already exists' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await query(`
      INSERT INTO users (username, email, password_hash, role) 
      VALUES (?, ?, ?, ?) 
    `, [username, email, passwordHash, userRole]);

    // Get the user we just inserted
    const userResult = await query('SELECT id, username, email, role, created_at FROM users WHERE email = ?', [email]);
    const user = userResult.rows[0];

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user by email
    const result = await query(`
      SELECT id, username, email, password_hash, role, created_at 
      FROM users 
      WHERE email = ?
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    const user = result.rows[0];

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await query(`
      SELECT id, username, email, role, created_at 
      FROM users 
      WHERE id = ?
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, email } = req.body;

    // Validate input
    if (!username || !email) {
      return res.status(400).json({ 
        error: 'Username and email are required' 
      });
    }

    // Check if email/username is already taken by another user
    const existingUser = await query(`
      SELECT id FROM users 
      WHERE (email = ? OR username = ?) AND id != ?
    `, [email, username, userId]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Email or username already in use by another user' 
      });
    }

    const result = await query(`
      UPDATE users 
      SET username = ?, email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [username, email, userId]);

    // Get updated user data
    const userResult = await query(`
      SELECT id, username, email, role, created_at, updated_at
      FROM users 
      WHERE id = ?
    `, [userId]);

    const user = userResult.rows[0];

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile
};