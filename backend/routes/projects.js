const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { 
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { getStepsByProjectId } = require('../controllers/stepController');

// POST /api/projects - Create a new project (protected)
router.post('/', authenticateToken, createProject);

// GET /api/projects - Get all projects (public for now, could be protected)
router.get('/', getAllProjects);

// GET /api/projects/:id - Get a specific project with steps and media (public for now)
router.get('/:id', getProjectById);

// GET /api/projects/:id/steps - Get steps for a specific project
router.get('/:id/steps', getStepsByProjectId);

// PUT /api/projects/:id - Update a project (protected)
router.put('/:id', authenticateToken, updateProject);

// DELETE /api/projects/:id - Delete a project (protected)
router.delete('/:id', authenticateToken, deleteProject);

module.exports = router;