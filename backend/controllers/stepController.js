const { query } = require('../db-local');

// Get steps by project ID
const getStepsByProjectId = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    
    const result = await query(
      `SELECT * FROM steps WHERE project_id = ? ORDER BY created_at ASC`,
      [projectId]
    );
    
    // For each step, get its media
    const steps = [];
    for (const step of result.rows) {
      const mediaResult = await query(
        `SELECT * FROM step_media WHERE step_id = ?`,
        [step.id]
      );
      
      steps.push({
        ...step,
        media: mediaResult.rows || []
      });
    }
    
    res.json(steps);
    
  } catch (error) {
    console.error('Error fetching steps:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a step to a project
const createStep = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await query(
      `INSERT INTO steps (project_id, title, description, status) 
       VALUES (?, ?, ?, ?) RETURNING *`,
      [projectId, title, description, status || 'not_started']
    );

    res.status(201).json({
      message: 'Step created successfully',
      step: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating step:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update step
const updateStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    
    console.log('Updating step:', { id, title, description, status });

    const result = await query(
      `UPDATE steps 
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           status = COALESCE(?, status)
       WHERE id = ?
       RETURNING *`,
      [title, description, status, id]
    );
    
    console.log('Update result:', result);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Step not found' });
    }

    res.json({
      message: 'Step updated successfully',
      step: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating step:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete step
const deleteStep = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `DELETE FROM steps WHERE id = ? RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Step not found' });
    }

    res.json({ message: 'Step deleted successfully' });

  } catch (error) {
    console.error('Error deleting step:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Upload media for a step
const uploadStepMedia = async (req, res) => {
  try {
    const { stepId } = req.params;
    
    // Check if step exists
    const stepResult = await query(
      `SELECT id FROM steps WHERE id = ?`,
      [stepId]
    );

    if (stepResult.rows.length === 0) {
      return res.status(404).json({ error: 'Step not found' });
    }

    // Handle uploaded files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const mediaRecords = [];

    for (const file of req.files) {
      const mediaType = file.mimetype.startsWith('image/') ? 'image' : 'video';
      const mediaUrl = `/uploads/${file.filename}`;

      const result = await query(
        `INSERT INTO step_media (step_id, media_type, media_url) 
         VALUES (?, ?, ?) RETURNING *`,
        [stepId, mediaType, mediaUrl]
      );

      mediaRecords.push(result.rows[0]);
    }

    res.status(201).json({
      message: 'Media uploaded successfully',
      media: mediaRecords
    });

  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete media
const deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const result = await query(
      `DELETE FROM step_media WHERE id = ? RETURNING id`,
      [mediaId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.json({ message: 'Media deleted successfully' });

  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStepsByProjectId,
  createStep,
  updateStep,
  deleteStep,
  uploadStepMedia,
  deleteMedia
};