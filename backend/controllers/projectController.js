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

    // Validate difficulty
    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ 
        error: 'Difficulty must be Easy, Medium, or Hard' 
      });
    }

    // Start transaction
    await query('BEGIN');

    // Insert project with user association
    const projectResult = await query(
      `INSERT INTO projects (user_id, title, difficulty, estimated_time, description, is_demo) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, title, difficulty, estimated_time, description, false]
    );

    // Get the project we just inserted
    const projectResultCheck = await query('SELECT * FROM projects WHERE id = ?', [projectResult.rows[0].id]);
    const project = projectResultCheck.rows[0];
    
    // Insert steps if provided
    if (steps && Array.isArray(steps) && steps.length > 0) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        await query(
          `INSERT INTO steps (project_id, title, description, detailed_content, code, order_number, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [project.id, step.title, step.description || null, step.detailed_content || null, step.code || null, i + 1, step.status || 'not_started']
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

      for (let i = 0; i < defaultSteps.length; i++) {
        const step = defaultSteps[i];
        await query(
          `INSERT INTO steps (project_id, title, description, detailed_content, code, order_number, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [project.id, step.title, step.description, step.detailed_content || null, step.code || null, i + 1, step.status]
        );
      }
    }

    await query('COMMIT');

    // Fetch complete project with steps
    const completeProject = await getProjectWithSteps(project.id);
    
    res.status(201).json({
      message: 'Project created successfully',
      project: completeProject
    });

  } catch (error) {
    await query('ROLLBACK');
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to get project with steps and calculate progress
const getProjectWithSteps = async (projectId) => {
  try {
    // Get project details
    const projectResult = await query(
      `SELECT * FROM projects WHERE id = ?`,
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      throw new Error('Project not found');
    }

    const project = projectResult.rows[0];

    // Get steps ordered by order_number
    const stepsResult = await query(
      `SELECT * FROM steps WHERE project_id = ? ORDER BY order_number ASC`,
      [projectId]
    );

    // For each step, get its media
    const steps = [];
    for (const row of stepsResult.rows) {
      const mediaResult = await query(
        `SELECT * FROM step_media WHERE step_id = ?`,
        [row.id]
      );

      // Parse components if stored as JSON string
      let components = row.components;
      if (components && typeof components === 'string') {
        try { components = JSON.parse(components); } catch (e) { /* keep as string */ }
      }

      steps.push({
        id: row.id,
        project_id: row.project_id,
        title: row.title,
        description: row.description,
        components: components || [],
        connections: row.connections || '',
        working: row.working || '',
        instructions: row.instructions || '',
        code: row.code || row.detailed_content || '',
        conclusion: row.conclusion || '',
        order_number: row.order_number || null,
        step_number: row.step_number || row.order_number || null,
        status: row.status,
        media: mediaResult.rows || [],
        created_at: row.created_at,
        updated_at: row.updated_at
      });
    }

    // Calculate progress
    const totalSteps = steps.length;
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    return {
      ...project,
      steps,
      progress,
      total_steps: totalSteps.toString(),
      completed_steps: completedSteps.toString()
    };

  } catch (error) {
    throw error;
  }
};

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    let projectsResult;
    
    // For demo projects, return all projects regardless of authentication
    // This allows both authenticated and non-authenticated users to see all projects
    projectsResult = await query(
      `SELECT p.*, 
              COUNT(s.id) as total_steps,
              COUNT(CASE WHEN s.status = 'completed' THEN 1 END) as completed_steps
       FROM projects p
       LEFT JOIN steps s ON p.id = s.project_id
       WHERE p.is_demo = true OR p.user_id = ?
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [req.userId || null]
    );
    
    const projects = projectsResult.rows.map(project => ({
      ...project,
      progress: project.total_steps > 0 
        ? Math.round((project.completed_steps / project.total_steps) * 100)
        : 0
    }));

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
    const project = await getProjectWithSteps(id);
    res.json(project);
  } catch (error) {
    if (error.message === 'Project not found') {
      return res.status(404).json({ error: 'Project not found' });
    }
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, difficulty, estimated_time, description, progress, steps } = req.body;
    const userId = req.userId; // Get user ID from authenticated token

    // First, verify that the project belongs to the authenticated user
    const projectCheck = await query(
      `SELECT id FROM projects WHERE id = ? AND (user_id = ? OR is_demo = true)`,
      [id, userId]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied: You can only update your own projects' });
    }

    // Validate difficulty if provided
    if (difficulty && !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ 
        error: 'Difficulty must be Easy, Medium, or Hard' 
      });
    }

    // Validate progress if provided
    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return res.status(400).json({ 
        error: 'Progress must be between 0 and 100' 
      });
    }

    // Start transaction
    await query('BEGIN');

    // Update project details
    await query(
      `UPDATE projects 
       SET title = COALESCE(?, title),
           difficulty = COALESCE(?, difficulty),
           estimated_time = COALESCE(?, estimated_time),
           description = COALESCE(?, description),
           progress = COALESCE(?, progress),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, difficulty, estimated_time, description, progress, id]
    );

    // If steps are provided, update them
    if (steps && Array.isArray(steps)) {
      // Delete existing steps
      await query(`DELETE FROM steps WHERE project_id = ?`, [id]);
      
      // Insert new steps
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        await query(
          `INSERT INTO steps (project_id, title, description, detailed_content, code, order_number, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, step.title, step.description || null, step.detailed_content || null, step.code || null, i + 1, step.status || 'not_started']
        );
      }
    }

    await query('COMMIT');

    // Get the updated project
    const updatedProject = await getProjectWithSteps(id);

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });

  } catch (error) {
    await query('ROLLBACK');
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