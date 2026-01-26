const express = require('express');
const router = express.Router();
const { upload, handleMulterError } = require('../middleware/multer');
const { uploadStepMedia, deleteMedia } = require('../controllers/stepController');

// POST /api/steps/:stepId/media - Upload media for a step
router.post('/steps/:stepId/media', 
  upload.array('media', 10), 
  handleMulterError,
  uploadStepMedia
);

// DELETE /api/media/:mediaId - Delete media
router.delete('/media/:mediaId', deleteMedia);

module.exports = router;