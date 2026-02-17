const express = require('express');
const router = express.Router();
const { 
  createStep,
  updateStep,
  deleteStep,
  getStepsByProjectId,
  getStepById,
  uploadStepMedia,
  deleteMedia
} = require('../controllers/stepController');

// POST /api/projects/:projectId/steps - Add a step to a project
router.post('/projects/:projectId/steps', createStep);

// GET /api/projects/:projectId/steps - list steps
router.get('/projects/:projectId/steps', getStepsByProjectId);

// GET single step
router.get('/projects/:projectId/steps/:stepId', getStepById);

// PUT /api/steps/:id - Update a step
router.put('/steps/:id', updateStep);

// DELETE /api/steps/:id - Delete a step
router.delete('/steps/:id', deleteStep);

// Upload media for step
router.post('/steps/:stepId/media', uploadStepMedia);

// Delete media
router.delete('/steps/media/:mediaId', deleteMedia);

module.exports = router;