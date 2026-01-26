const { v4: uuidv4 } = require('uuid');
const { query } = require('../db-local'); // Use local database

// Create a new project
const createProject = async (req, res) => {
  try {
    const { title, difficulty, estimated_time, description, steps } = req.body;
    const userId = req.userId; // Get user ID from authenticated token
    
    // Validate required fields
    if (!title || !difficulty || !description) {
      return res.status(400).json({ 
        error: 'Title, difficulty, and description are required' 
      });
    }

    // Insert project with user association
    const projectResult = await query(
      `INSERT INTO projects (user_id, title, difficulty, estimated_time, description) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, title, difficulty, estimated_time, description]
    );

    // Get the project we just inserted
    const projectResultCheck = await query('SELECT * FROM projects WHERE id = ?', [projectResult.rows[0].id]);
    const project = projectResultCheck.rows[0];
    
    // Insert steps if provided
    if (steps && Array.isArray(steps) && steps.length > 0) {
      for (const step of steps) {
        await query(
          `INSERT INTO steps (project_id, title, description, status) 
           VALUES (?, ?, ?, ?)`,
          [project.id, step.title, step.description, step.status || 'not_started']
        );
      }
    } else {
      // Insert default steps for IoT projects
      const defaultSteps = [
        {
          title: 'Project Setup',
          description: 'Install Arduino IDE and ESP32 board support',
          status: 'not_started'
        },
        {
          title: 'Hardware Connection',
          description: 'Connect DHT22 sensor to ESP32 using breadboard',
          status: 'not_started'
        },
        {
          title: 'Library Installation',
          description: 'Install DHT sensor library and WiFi manager',
          status: 'not_started'
        },
        {
          title: 'Basic Code',
          description: 'Write code to read temperature and humidity data',
          status: 'not_started'
        },
        {
          title: 'WiFi Connection',
          description: 'Configure WiFi credentials and connect to network',
          status: 'not_started'
        },
        {
          title: 'Data Logging',
          description: 'Send sensor data to cloud service (ThingSpeak)',
          status: 'not_started'
        },
        {
          title: 'Dashboard Creation',
          description: 'Create web dashboard to visualize data',
          status: 'not_started'
        },
        {
          title: 'Testing & Calibration',
          description: 'Test the complete system and calibrate readings',
          status: 'not_started'
        }
      ];

      for (const step of defaultSteps) {
        await query(
          `INSERT INTO steps (project_id, title, description, status) 
           VALUES (?, ?, ?, ?)`,
          [project.id, step.title, step.description, step.status]
        );
      }
    }

    res.status(201).json({
      message: 'Project created successfully',
      project: project
    });

  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    let projectsResult;
    
    // For demo projects, return all projects regardless of authentication
    // This allows both authenticated and non-authenticated users to see all projects
    projectsResult = await query(
      `SELECT * FROM projects ORDER BY created_at DESC`
    );
    
    const projects = [];
    
    // For each project, get its steps to calculate progress
    for (const project of projectsResult.rows) {
      const stepsResult = await query(
        `SELECT * FROM steps WHERE project_id = ?`,
        [project.id]
      );
      
      const totalSteps = stepsResult.rows.length;
      const completedSteps = stepsResult.rows.filter(step => step.status === 'completed').length;
      
      projects.push({
        ...project,
        total_steps: totalSteps.toString(),
        completed_steps: completedSteps.toString(),
        progress: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
      });
    }

    res.json(projects);

  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get project by ID with steps and media
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get project details
    const projectResult = await query(
      `SELECT * FROM projects WHERE id = ?`,
      [id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectResult.rows[0];

    // Get steps
    const stepsResult = await query(
      `SELECT * FROM steps WHERE project_id = ? ORDER BY created_at ASC`,
      [id]
    );

    // For each step, get its media
    const steps = [];
    for (const step of stepsResult.rows) {
      const mediaResult = await query(
        `SELECT * FROM step_media WHERE step_id = ?`,
        [step.id]
      );
      
      steps.push({
        ...step,
        media: mediaResult.rows || []
      });
    }

    // Calculate progress
    const totalSteps = steps.length;
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    res.json({
      ...project,
      steps,
      progress,
      total_steps: totalSteps.toString(),
      completed_steps: completedSteps.toString()
    });

  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, difficulty, estimated_time, description } = req.body;
    const userId = req.userId; // Get user ID from authenticated token

    // First, verify that the project belongs to the authenticated user
    const projectCheck = await query(
      `SELECT id FROM projects WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied: You can only update your own projects' });
    }

    const result = await query(
      `UPDATE projects 
       SET title = COALESCE(?, title),
           difficulty = COALESCE(?, difficulty),
           estimated_time = COALESCE(?, estimated_time),
           description = COALESCE(?, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, difficulty, estimated_time, description, id]
    );

    // Get the updated project
    const updatedProject = await query('SELECT * FROM projects WHERE id = ?', [id]);

    if (updatedProject.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project: updatedProject.rows[0]
    });

  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Get user ID from authenticated token

    // First, verify that the project belongs to the authenticated user
    const projectCheck = await query(
      `SELECT id FROM projects WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied: You can only delete your own projects' });
    }

    const result = await query(
      `DELETE FROM projects WHERE id = ?`,
      [id]
    );

    res.json({ message: 'Project deleted successfully' });

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
};