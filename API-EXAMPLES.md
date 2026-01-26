# SmartDrishti API Examples

## Project Management Examples

### Create a New Project
```javascript
// POST /api/projects
const projectData = {
  title: "Smart Temperature Monitor",
  difficulty: "Easy",
  estimated_time: "2-3 hours",
  description: "Build a temperature monitoring system using ESP32 and DHT22 sensor",
  steps: [
    {
      title: "Project Setup",
      description: "Install Arduino IDE and ESP32 board support",
      status: "not_started"
    },
    {
      title: "Hardware Connection",
      description: "Connect DHT22 sensor to ESP32 using breadboard",
      status: "not_started"
    }
  ]
};

// Response
{
  "message": "Project created successfully",
  "project": {
    "id": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
    "title": "Smart Temperature Monitor",
    "difficulty": "Easy",
    "estimated_time": "2-3 hours",
    "description": "Build a temperature monitoring system...",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get All Projects
```javascript
// GET /api/projects

// Response
[
  {
    "id": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
    "title": "Smart Temperature Monitor",
    "difficulty": "Easy",
    "estimated_time": "2-3 hours",
    "description": "Build a temperature monitoring system...",
    "created_at": "2024-01-15T10:30:00.000Z",
    "total_steps": 8,
    "completed_steps": 3,
    "progress": 37
  },
  {
    "id": "b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9",
    "title": "Home Automation Hub",
    "difficulty": "Medium",
    "estimated_time": "4-6 hours",
    "description": "Create a centralized hub for controlling smart devices...",
    "created_at": "2024-01-14T14:20:00.000Z",
    "total_steps": 10,
    "completed_steps": 0,
    "progress": 0
  }
]
```

### Get Specific Project
```javascript
// GET /api/projects/a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8

// Response
{
  "id": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "title": "Smart Temperature Monitor",
  "difficulty": "Easy",
  "estimated_time": "2-3 hours",
  "description": "Build a temperature monitoring system...",
  "created_at": "2024-01-15T10:30:00.000Z",
  "steps": [
    {
      "id": "c3d4e5f6-g7h8-9012-i3j4-k5l6m7n8o9p0",
      "project_id": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
      "title": "Project Setup",
      "description": "Install Arduino IDE and ESP32 board support",
      "status": "completed",
      "created_at": "2024-01-15T10:30:00.000Z",
      "media": [
        {
          "id": "d4e5f6g7-h8i9-0123-j4k5-l6m7n8o9p0q1",
          "media_type": "image",
          "media_url": "/uploads/photo-12345.jpg",
          "created_at": "2024-01-15T11:00:00.000Z"
        }
      ]
    },
    {
      "id": "e5f6g7h8-i9j0-1234-k5l6-m7n8o9p0q1r2",
      "project_id": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
      "title": "Hardware Connection",
      "description": "Connect DHT22 sensor to ESP32 using breadboard",
      "status": "working",
      "created_at": "2024-01-15T10:35:00.000Z",
      "media": []
    }
  ],
  "progress": 37,
  "total_steps": 8,
  "completed_steps": 3
}
```

## Step Management Examples

### Add a New Step
```javascript
// POST /api/projects/a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8/steps
const stepData = {
  title: "Code Implementation",
  description: "Write the main program code for temperature reading",
  status: "not_started"
};

// Response
{
  "message": "Step created successfully",
  "step": {
    "id": "f6g7h8i9-j0k1-2345-l6m7-n8o9p0q1r2s3",
    "project_id": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
    "title": "Code Implementation",
    "description": "Write the main program code for temperature reading",
    "status": "not_started",
    "created_at": "2024-01-15T12:00:00.000Z"
  }
}
```

### Update Step Status
```javascript
// PUT /api/steps/f6g7h8i9-j0k1-2345-l6m7-n8o9p0q1r2s3
const updateData = {
  status: "completed"
};

// Response
{
  "message": "Step updated successfully",
  "step": {
    "id": "f6g7h8i9-j0k1-2345-l6m7-n8o9p0q1r2s3",
    "project_id": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
    "title": "Code Implementation",
    "description": "Write the main program code for temperature reading",
    "status": "completed",
    "created_at": "2024-01-15T12:00:00.000Z"
  }
}
```

### Delete a Step
```javascript
// DELETE /api/steps/f6g7h8i9-j0k1-2345-l6m7-n8o9p0q1r2s3

// Response
{
  "message": "Step deleted successfully"
}
```

## Media Management Examples

### Upload Media to Step
```javascript
// POST /api/steps/e5f6g7h8-i9j0-1234-k5l6-m7n8o9p0q1r2/media
// Content-Type: multipart/form-data

// Form Data:
// media: [file1.jpg, file2.mp4]

// Response
{
  "message": "Media uploaded successfully",
  "media": [
    {
      "id": "g7h8i9j0-k1l2-3456-m7n8-o9p0q1r2s3t4",
      "step_id": "e5f6g7h8-i9j0-1234-k5l6-m7n8o9p0q1r2",
      "media_type": "image",
      "media_url": "/uploads/media-1234567890-123456789.jpg",
      "created_at": "2024-01-15T12:30:00.000Z"
    },
    {
      "id": "h8i9j0k1-l2m3-4567-n8o9-p0q1r2s3t4u5",
      "step_id": "e5f6g7h8-i9j0-1234-k5l6-m7n8o9p0q1r2",
      "media_type": "video",
      "media_url": "/uploads/media-1234567891-987654321.mp4",
      "created_at": "2024-01-15T12:30:01.000Z"
    }
  ]
}
```

### Delete Media
```javascript
// DELETE /api/media/g7h8i9j0-k1l2-3456-m7n8-o9p0q1r2s3t4

// Response
{
  "message": "Media deleted successfully"
}
```

## Error Responses

### Validation Error
```javascript
// 400 Bad Request
{
  "error": "Title, difficulty, and description are required"
}
```

### Not Found
```javascript
// 404 Not Found
{
  "error": "Project not found"
}
```

### Internal Server Error
```javascript
// 500 Internal Server Error
{
  "error": "Internal server error"
}
```

## Frontend Integration Examples

### Using the API Client
```typescript
import { projectAPI, stepAPI, mediaAPI } from '@/api';

// Create a project
const newProject = await projectAPI.createProject({
  title: "My IoT Project",
  difficulty: "Easy",
  description: "A great learning project"
});

// Get all projects
const projects = await projectAPI.getProjects();

// Get specific project
const project = await projectAPI.getProjectById(projectId);

// Update step status
await stepAPI.updateStep(stepId, { status: 'completed' });

// Upload media
const formData = new FormData();
formData.append('media', file);
await mediaAPI.uploadStepMedia(stepId, formData);
```

### Error Handling
```typescript
try {
  const project = await projectAPI.createProject(projectData);
  console.log('Project created:', project);
} catch (error) {
  console.error('Failed to create project:', error);
  // Handle error appropriately in UI
}
```

## Curl Examples

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Temperature Logger",
    "difficulty": "Easy",
    "estimated_time": "2 hours",
    "description": "Monitor temperature with ESP32"
  }'
```

### Get Projects
```bash
curl http://localhost:5000/api/projects
```

### Update Step
```bash
curl -X PUT http://localhost:5000/api/steps/step-id-here \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

This API provides a complete backend for the SmartDrishti IoT learning platform, enabling full project management, step tracking, and media handling capabilities.