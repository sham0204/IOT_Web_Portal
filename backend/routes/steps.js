const express = require('express');
const router = express.Router();
const { 
  createStep,
  updateStep,
  deleteStep
} = require('../controllers/stepController');

// POST /api/projects/:projectId/steps - Add a step to a project
router.post('/projects/:projectId/steps', createStep);

// PUT /api/steps/:id - Update a step
router.put('/steps/:id', updateStep);

// DELETE /api/steps/:id - Delete a step
router.delete('/steps/:id', deleteStep);

module.exports = router;