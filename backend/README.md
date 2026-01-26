# SmartDrishti IoT Learning Platform - Backend

## Overview
This is the backend for the SmartDrishti IoT Learning Platform, built with Node.js, Express, and Neon PostgreSQL.

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database (Neon recommended)
- Git

## Setup Instructions

### 1. Database Setup
1. Sign up for [Neon PostgreSQL](https://neon.tech/)
2. Create a new project
3. Copy your connection string (should look like: `postgresql://username:password@host.neon.tech/dbname`)
4. Update the `.env` file with your connection string

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Edit the `.env` file in the `backend` directory:
```env
PORT=5000
DATABASE_URL=your_neon_postgres_connection_string_here
FRONTEND_URL=http://localhost:5173
```

### 4. Start the Backend Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend will be available at `http://localhost:5000`

## API Endpoints

### Projects
- `POST /api/projects` - Create a new project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project with steps and media
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Steps
- `POST /api/projects/:projectId/steps` - Add a step to a project
- `PUT /api/steps/:id` - Update a step
- `DELETE /api/steps/:id` - Delete a step

### Media
- `POST /api/steps/:stepId/media` - Upload media for a step
- `DELETE /api/media/:mediaId` - Delete media

### Health Check
- `GET /api/health` - Check if the server is running

## Database Schema

### projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  estimated_time TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### steps
```sql
CREATE TABLE steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'working', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### step_media
```sql
CREATE TABLE step_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID REFERENCES steps(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## File Uploads
- Files are stored in the `backend/uploads/` directory
- Supported formats: Images (jpg, png, gif) and Videos (mp4, mov, avi)
- Maximum file size: 10MB
- Maximum files per upload: 10

## Frontend Integration

The frontend is located in the `smartdrishti-platform` directory and uses the API through the `src/api.ts` file.

### Running the Frontend
```bash
cd ../smartdrishti-platform
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Development

### Folder Structure
```
backend/
├── controllers/          # Business logic
│   ├── projectController.js
│   └── stepController.js
├── middleware/           # Middleware functions
│   └── multer.js        # File upload handling
├── routes/              # API route definitions
│   ├── projects.js
│   ├── steps.js
│   └── uploads.js
├── uploads/             # Uploaded files storage
├── db.js               # Database connection and initialization
├── server.js           # Main server file
├── .env                # Environment variables
└── package.json        # Dependencies
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your `DATABASE_URL` in `.env`
   - Ensure Neon PostgreSQL project is active
   - Verify SSL settings in `db.js`

2. **CORS Error**
   - Make sure `FRONTEND_URL` in `.env` matches your frontend URL
   - Restart the backend server after changing environment variables

3. **File Upload Issues**
   - Ensure the `uploads` directory exists and is writable
   - Check file size limits in `middleware/multer.js`

4. **Port Already in Use**
   - Change the `PORT` in `.env` to a different port
   - Or kill the process using the port: `lsof -i :5000` then `kill -9 <PID>`

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
MIT License